
let init = function(db, config){

	// Create the tables we need to store galleries and files
	db.schema.createTableIfNotExists('gallery', function (table) {
		table.increments()
		table.string('name')
		table.timestamps()
	}).then(() => {})

	db.schema.createTableIfNotExists('files', function (table) {
		table.increments()
		table.string('name')
		table.string('original')
		table.string('type')
		table.string('size')
		table.string('ip')
		table.integer('galleryid')
		table.timestamps()
	}).then(() => {})

	db.schema.createTableIfNotExists('tokens', function (table) {
		table.string('name')
		table.string('value')
		table.timestamps()
	}).then(() => {

		// == Generate a 1 time token == //
		db.table('tokens').then((tokens) => {
			if(tokens.length !== 0) return printAndSave(config, tokens[0].value, tokens[1].value)

			// This is the first launch of the app
			let clientToken = require('randomstring').generate()
			let adminToken = require('randomstring').generate()

			db.table('tokens').insert(
				[
					{ 
						name: 'client', 
						value: clientToken 
					},
					{ 
						name: 'admin', 
						value: adminToken 
					}
				]
			).then(() => {
				printAndSave(config, clientToken, adminToken)
			})

		})

	})

}

function printAndSave(config, clientToken, adminToken){
	console.log('Your client token is: ' + clientToken)
	console.log('Your admin token is: ' + adminToken)
	config.clientToken = clientToken
	config.adminToken = adminToken
}

module.exports = init