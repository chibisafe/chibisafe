const config = require('./config.js')
const routes = require('./routes.js')
const express = require('express')
const db = require('knex')(config.database)
const fs = require('fs')
const safe = express()

fs.existsSync('./' + config.uploads.folder) || fs.mkdirSync('./' + config.uploads.folder)
fs.existsSync('./' + config.logsFolder) || fs.mkdirSync('./' + config.logsFolder)
fs.existsSync('db') || fs.writeFile('db', '')

safe.use('/', express.static('./uploads'))
safe.use('/api'  , routes)
safe.use('/panel', express.static('./dashboard'))

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

safe.enable('trust proxy')

safe.listen(config.port, () => console.log(`loli-safe started on port ${config.port}`))