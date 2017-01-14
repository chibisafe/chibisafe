const config = require('./config.js')
const routes = require('./routes/routes.js')
const express = require('express')
const db = require('knex')(config.database)
const fs = require('fs')
const safe = express()

require('./database/db.js')(db)

fs.existsSync('./' + config.uploads.folder) || fs.mkdirSync('./' + config.uploads.folder)
fs.existsSync('./' + config.logsFolder) || fs.mkdirSync('./' + config.logsFolder)

safe.enable('trust proxy')

let prefix = config.uploads.prefix
if( prefix !== '' )
	prefix = prefix + '/'

safe.use('/' + prefix, express.static('./uploads'))
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

safe.listen(config.port, () => console.log(`loli-safe started on port ${config.port}`))