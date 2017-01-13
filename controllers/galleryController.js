const config = require('../config.js')
const db = require('knex')(config.database)

let galleryController = {}

galleryController.list = function(req, res, next){
	if(!config.privacy.public)
		if(!config.privacy.IPs.includes(req.ip)) return res.status(401).send('Not Authorized!')

	db.table('gallery').select('id', 'name').then((data) => {
		res.json({ data })
	})
}