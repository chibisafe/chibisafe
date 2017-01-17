const config = require('../config.js')
const db = require('knex')(config.database)

let albumsController = {}

albumsController.list = function(req, res, next){
	
	if(req.headers.auth !== config.adminToken)
		return res.status(401).send('not-authorized')

	db.table('albums').select('id', 'name').then((albums) => {
		return res.json({ albums })
	})
}

albumsController.test = function(req, res, next){
	
	if(req.headers.auth !== config.adminToken)
		return res.status(401).send('not-authorized')

	let testdata = [
		{name: 'Test 1'},
		{name: 'Test 2'},
		{name: 'Test 3'},
		{name: 'Test 4'},
		{name: 'Test 5'}
	]

	db.table('albums').insert(testdata).then(() => {})
}

module.exports = albumsController