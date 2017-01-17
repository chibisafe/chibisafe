const config = require('../config.js')
const db = require('knex')(config.database)

let galleryController = {}

galleryController.list = function(req, res, next){
	
	if(config.private === true)
		if(req.headers.auth !== config.clientToken)
			return res.status(401).send('not-authorized')

	db.table('gallery').select('id', 'name').then((galleries) => {
		return res.json({ galleries })
	})
}

galleryController.test = function(req, res, next){
	
	if(config.private === true)
		if(req.headers.auth !== config.clientToken)
			return res.status(401).send('not-authorized')

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