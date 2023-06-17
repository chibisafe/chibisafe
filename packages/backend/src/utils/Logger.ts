import * as FileStreamRotator from 'file-stream-rotator';
import process from 'node:process';
import path from 'node:path';
import type { FastifyRequest, FastifyReply } from 'fastify';

const serializers = {
	res(reply: FastifyReply) {
		return {
			statusCode: reply.statusCode
		};
	},
	req(request: FastifyRequest) {
		return {
			method: request.method,
			url: request.url,
			parameters: request.params,
			remoteAddress: request.ip
		};
	}
};

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
		serializers,
		stream: FileStreamRotator.getStream({
			filename: path.join(__dirname, '..', '..', '..', '..', 'logs', 'chibisafe-%DATE%'),
			extension: '.log',
			date_format: 'YYYY-MM-DD',
			frequency: 'daily',
			audit_file: path.join(__dirname, '..', '..', '..', '..', 'logs', 'chibisafe-audit.json')
		})
	}
};
