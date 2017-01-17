const config = require('./config.js')
const api = require('./routes/api.js')
const express = require('express')
const db = require('knex')(config.database)
const fs = require('fs')
const safe = express()

require('./database/db.js')(db, config)

fs.existsSync('./' + config.uploads.folder) || fs.mkdirSync('./' + config.uploads.folder)
fs.existsSync('./' + config.logsFolder) || fs.mkdirSync('./' + config.logsFolder)

safe.enable('trust proxy')

let prefix = config.uploads.prefix
if( prefix !== '' )
	prefix = prefix + '/'

safe.use('/' + prefix, express.static('./uploads'))
safe.use('/', express.static('./public'))
safe.use('/api', api)

safe.get('/', function (req, res, next) {
	res.sendFile('home.html', { 
		root: './pages/' 
	})
})

safe.get('/panel', function (req, res, next) {
	res.sendFile('panel.html', { 
		root: './pages/' 
	})
})

safe.use(function (req, res, next) {
	res.status(404).sendFile('404.html', {
		root: './pages/error/',
	})
})

safe.use(function (err, req, res, next) {
	res.status(500).end()
})

safe.listen(config.port, () => console.log(`loli-safe started on port ${config.port}`))