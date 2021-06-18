require('dotenv').config();

const Util = require('../utils/Util');

const start = async () => {
	try {
		await Util.writeConfigToDb(Util.getEnvironmentDefaults());
		console.log('Configuration overwriten, you can now start chibisafe');
		process.exit(0);
	} catch (error) {
		console.error(error);
	}
};

start();
