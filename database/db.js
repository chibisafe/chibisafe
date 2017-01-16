
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
		table.string('original')
		table.string('type')
		table.string('size')
		table.string('ip')
		table.integer('galleryid')
		table.timestamps()
	}).then(() => {})

}

module.exports = init