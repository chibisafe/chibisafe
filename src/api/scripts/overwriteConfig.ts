import dotenv from 'dotenv';
dotenv.config();

import { writeConfigToDb, getEnvironmentDefaults } from '../utils/Util';

const start = async () => {
	try {
		const defaults = getEnvironmentDefaults();
		const keys = Object.keys(defaults);
		for (const item of keys) {
			await writeConfigToDb({
				key: item,
				value: defaults[item]
			});
		}
		console.log('Configuration overwriten, you can now start chibisafe');
		process.exit(0);
	} catch (error) {
		console.error(error);
	}
};

void start();
