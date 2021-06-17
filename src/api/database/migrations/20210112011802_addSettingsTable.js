const Util = require('../../utils/Util');

exports.up = async knex => {
	await knex.schema.createTable('settings', table => {
		table.string('key');
		table.string('value');
	});

	try {
		const defaults = Util.getEnvironmentDefaults();
		const keys = Object.keys(defaults);
		for (const item of keys) {
			await Util.writeConfigToDb({
				key: item,
				value: defaults[item]
			});
		}
	} catch (error) {
		console.error(error);
	}
};

exports.down = async knex => {
	await knex.schema.dropTableIfExists('settings');
};
