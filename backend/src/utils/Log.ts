import pino from 'pino';
import process from 'node:process';

const log = pino({
	level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
	sync: false
});

export default log;
