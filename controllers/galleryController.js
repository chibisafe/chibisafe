const config = require('../config.js')
const db = require('knex')(config.database)

let galleryController = {}

galleryController.list = function(req, res, next){
	
	if(!config.privacy.public)
		if(!config.privacy.IPs.includes(req.ip)) return res.status(401).send('not-authorized')

	db.table('gallery').select('id', 'name').then((data) => {
		res.json({ data })
	})
}

galleryController.test = function(req, res, next){
	
	if(!config.privacy.public)
		if(!config.privacy.IPs.includes(req.ip)) return res.status(401).send('not-authorized')

	let testdata = [
		{name: 'Test 1'},
		{name: 'Test 2'},
		{name: 'Test 3'},
		{name: 'Test 4'},
		{name: 'Test 5'}
	]

	db.table('gallery').insert(testdata).then(() => {})
}

module.exports = galleryController