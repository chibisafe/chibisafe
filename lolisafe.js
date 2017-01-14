const config = require('./config.js')
const routes = require('./routes.js')
const express = require('express')
const db = require('knex')(config.database)
const fs = require('fs')
const safe = express()

fs.existsSync('./' + config.uploads.folder) || fs.mkdirSync('./' + config.uploads.folder)
fs.existsSync('./' + config.logsFolder) || fs.mkdirSync('./' + config.logsFolder)
fs.existsSync('db') || fs.writeFile('db', '')

safe.enable('trust proxy')

safe.use('/', express.static('./uploads'))
safe.use('/', express.static('./public'))
safe.use('/api'  , routes)

safe.use(function (req, res, next) {
	res.status(404).sendFile('404.html', {
		root: './public/error/',
	})
})

safe.use(function (err, req, res, next) {
	res.status(500).end()
})

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

safe.listen(config.port, () => console.log(`loli-safe started on port ${config.port}`))