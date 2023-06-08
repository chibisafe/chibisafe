import pino from 'pino';
import process from 'node:process';

const log = pino(
	process.env.NODE_ENV === 'production'
		? {
				file: '../logs/chibisafe.log'
		  }
		: {
				transport: {
					target: 'pino-pretty',
					options: {
						translateTime: 'HH:MM:ss Z',
						ignore: 'pid,hostname'
					}
				},
				level: 'debug',
				sync: true
		  }
);

export default log;
