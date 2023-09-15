import * as FileStreamRotator from 'file-stream-rotator';
import process from 'node:process';
import path from 'node:path';
import pino from 'pino';

export const Logger = {
	development: {
		transport: {
			target: 'pino-pretty',
			options: {
				translateTime: 'HH:MM:ss Z',
				ignore: 'pid,hostname'
			}
		},
		level: 'debug',
		sync: true
	},
	production: {
		redact: {
			paths: ['hostname'],
			remove: true
		},
		stream: pino.multistream([
			{
				stream: process.stdout
			},
			{
				stream: FileStreamRotator.getStream({
					filename: path.join(__dirname, '..', '..', '..', '..', 'logs', 'chibisafe-%DATE%'),
					extension: '.log',
					date_format: 'YYYY-MM-DD',
					frequency: 'daily',
					audit_file: path.join(__dirname, '..', '..', '..', '..', 'logs', 'chibisafe-audit.json')
				})
			}
		])
	}
};
