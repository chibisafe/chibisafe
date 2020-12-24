const chalk = require('chalk');
const { dump } = require('dumper.js');

class Log {
	static info(args) {
		if (Log.checkIfArrayOrObject(args)) dump(args);
		else console.log(args); // eslint-disable-line no-console
	}

	static success(args) {
		if (Log.checkIfArrayOrObject(args)) dump(args);
		else console.log(chalk.green(args)); // eslint-disable-line no-console
	}

	static warn(args) {
		if (Log.checkIfArrayOrObject(args)) dump(args);
		else console.log(chalk.yellow(args)); // eslint-disable-line no-console
	}

	static error(args) {
		if (Log.checkIfArrayOrObject(args)) dump(args);
		else console.log(chalk.red(args)); // eslint-disable-line no-console
	}

	static debug(args) {
		if (Log.checkIfArrayOrObject(args)) dump(args);
		else console.log(chalk.gray(args)); // eslint-disable-line no-console
	}

	static checkIfArrayOrObject(thing) {
		if (typeof thing === typeof [] || typeof thing === typeof {}) return true;
		return false;
	}
}

module.exports = Log;
