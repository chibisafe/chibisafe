import pino from 'pino';

// Futher customize this logger as needed
// like saving logs to a folder and what not
// TODO: level should be `info` for production
const log = pino({
	level: 'debug'
});

export default log;
