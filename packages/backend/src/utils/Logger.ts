import * as FileStreamRotator from 'file-stream-rotator';
import process from 'node:process';
import path from 'node:path';
import pino from 'pino';
import pretty from 'pino-pretty';

const logger = {
	development: {
		transport: {
			target: 'pino-pretty',
			options: {
				translateTime: 'HH:MM:ss Z',
				ignore: 'pid,hostname',
				singleLine: true
			}
		},
		level: 'debug',
		sync: true
	},
	production: {
		redact: {
			paths: ['hostname'],
			remove: true
		}
	}
};

const loggerDestination = pino.multistream([
	{
		stream: pretty({
			hideObject: true,
			messageFormat: (log, messageKey) => {
				const message = log[messageKey] as string;

				if (log.method) {
					// eslint-disable-next-line @typescript-eslint/no-base-to-string
					return `${log.method} ${log.url} ${log.statusCode} ${log.responseTime}ms ${log.ip} ${
						message || ''
					}`;
				}

				return message;
			}
		})
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
]);

export const log =
	process.env.NODE_ENV === 'production' ? pino(logger.production, loggerDestination) : pino(logger.development);
