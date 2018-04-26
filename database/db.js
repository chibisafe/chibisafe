let init = function(db){

	// Create the tables we need to store galleries and files
	db.schema.createTableIfNotExists('albums', function (table) {
		table.increments();
		table.integer('userid');
		table.string('name');
		table.string('identifier');
		table.integer('enabled');
		table.integer('timestamp');
		table.integer('editedAt');
		table.integer('zipGeneratedAt');
	}).then(() => {});

	db.schema.createTableIfNotExists('files', function (table) {
		table.increments();
		table.integer('userid');
		table.string('name');
		table.string('original');
		table.string('type');
		table.string('size');
		table.string('hash');
		table.string('ip');
		table.integer('albumid');
		table.integer('timestamp');
	}).then(() => {});

	db.schema.createTableIfNotExists('users', function (table) {
		table.increments();
		table.string('username');
		table.string('password');
		table.string('token');
		table.integer('enabled');
		table.integer('timestamp');
	}).then(() => {
		db.table('users').where({username: 'root'}).then((user) => {
			if(user.length > 0) return;

			require('bcrypt').hash('root', 10, function(err, hash) {
				if(err) console.error('Error generating password hash for root');

				db.table('users').insert({
					username: 'root',
					password: hash,
					token: require('randomstring').generate(64),
					timestamp: Math.floor(Date.now() / 1000)
				}).then(() => {});
			});
		});
	});
};

module.exports = init;
