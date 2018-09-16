const chalk = require('chalk');
const { dump } = require('dumper.js');

class Log {
	static info(args) {
		if (this.checkIfArrayOrObject(args)) dump(args);
		else console.log(args); // eslint-disable-line no-console
	}

	static success(args) {
		if (this.checkIfArrayOrObject(args)) dump(args);
		else console.log(chalk.green(args)); // eslint-disable-line no-console
	}

	static warn(args) {
		if (this.checkIfArrayOrObject(args)) dump(args);
		else console.log(chalk.yellow(args)); // eslint-disable-line no-console
	}

	static error(args) {
		if (this.checkIfArrayOrObject(args)) dump(args);
		else console.log(chalk.red(args)); // eslint-disable-line no-console
	}

	/*
	static dump(args) {
		dump(args);
	}
	*/

	static checkIfArrayOrObject(thing) {
		if (typeof thing === typeof [] || typeof thing === typeof {}) return true;
		return false;
	}
}

module.exports = Log;
