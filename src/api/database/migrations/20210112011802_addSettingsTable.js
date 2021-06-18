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
			await knex('settings').insert({
				key: item,
				value: JSON.stringify(defaults[item])
			});
		}
	} catch (error) {
		console.error(error);
	}
};

exports.down = async knex => {
	await knex.schema.dropTableIfExists('settings');
};
