const config = require('./config.js')
const api = require('./routes/api.js')
const express = require('express')
const bodyParser = require('body-parser')
const rateLimit = require('express-rate-limit')
const db = require('knex')(config.database)
const fs = require('fs')
const safe = express()

require('./database/db.js')(db)

fs.existsSync('./' + config.logsFolder) || fs.mkdirSync('./' + config.logsFolder)
fs.existsSync('./' + config.uploads.folder) || fs.mkdirSync('./' + config.uploads.folder)
fs.existsSync('./' + config.uploads.folder + '/thumbs') || fs.mkdirSync('./' + config.uploads.folder + '/thumbs')

safe.set('trust proxy', 1)

let limiter = new rateLimit({ windowMs: 5000, max: 2 })
safe.use('/api/login/', limiter)
safe.use('/api/register/', limiter)

safe.use(bodyParser.urlencoded({ extended: true }))
safe.use(bodyParser.json())

safe.use('/', express.static('./uploads'))
safe.use('/', express.static('./public'))
safe.use('/api', api)

safe.get('/', (req, res, next) => res.sendFile('home.html', { root: './pages/' }))
safe.get('/faq', (req, res, next) => res.sendFile('faq.html', { root: './pages/' }))
safe.get('/auth', (req, res, next) => res.sendFile('auth.html', { root: './pages/' }))
safe.get('/dashboard', (req, res, next) => res.sendFile('dashboard.html', { root: './pages/' }))
safe.use((req, res, next) => res.status(404).sendFile('404.html', { root: './pages/error/' }))
safe.use((req, res, next) => res.status(500).sendFile('500.html', { root: './pages/error/' }))

safe.listen(config.port, () => console.log(`loli-safe started on port ${config.port}`))