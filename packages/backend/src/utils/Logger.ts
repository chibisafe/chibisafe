import path from 'node:path';
import process from 'node:process';
import { URL, fileURLToPath } from 'node:url';
import * as FileStreamRotator from 'file-stream-rotator';
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
		stream: pretty.default({
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
			filename: path.join(fileURLToPath(new URL('../../../../logs', import.meta.url)), 'chibisafe-%DATE%'),
			extension: '.log',
			date_format: 'YYYY-MM-DD',
			frequency: 'daily',
			audit_file: fileURLToPath(new URL('../../../../logs/chibisafe-audit.json', import.meta.url))
		})
	}
]);

export const log =
	process.env.NODE_ENV === 'production'
		? pino.default(logger.production, loggerDestination)
		: pino.default(logger.development);
