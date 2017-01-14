
let init = function(db){

	// Create the tables we need to store galleries and files
	db.schema.createTableIfNotExists('gallery', function (table) {
		table.increments()
		table.string('name')
		table.timestamps()
	}).then(() => {})

	db.schema.createTableIfNotExists('files', function (table) {
		table.increments()
		table.string('file')
		table.integer('galleryid')
	}).then(() => {})

}

module.exports = init