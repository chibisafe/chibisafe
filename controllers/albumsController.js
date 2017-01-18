const config = require('../config.js')
const db = require('knex')(config.database)

let albumsController = {}

albumsController.list = function(req, res, next){
	
	if(req.headers.auth !== config.adminToken)
		return res.status(401).send('not-authorized')

	let fields = ['id', 'name']

	if(req.headers.extended !== undefined)
		fields.push('timestamp')
	
	db.table('albums').select(fields).then((albums) => {

		if(req.headers.extended === undefined)
			return res.json({ success: true, albums })

		let ids = []
		for(let album of albums)
			ids.push(album.id)

		db.table('files').whereIn('albumid', ids).select('albumid').then((files) => {

			let albumsCount = {}
			
			for(let id of ids)  albumsCount[id] = 0
			for(let file of files) albumsCount[file.albumid] += 1
			for(let album of albums) album.files = albumsCount[album.id]

			return res.json({ success: true, albums })
		})
	})
}

albumsController.create = function(req, res, next){
	
	if(req.headers.auth !== config.adminToken)
		return res.status(401).send('not-authorized')

	let name = req.headers.name
	if(name === undefined || name === '')
		return res.json({ success: false, description: 'No album name specified' })	

	db.table('albums').where('name', name).then((album) => {
		if(album.length !== 0) return res.json({ success: false, description: 'There\'s already an album with that name' })	

		db.table('albums').insert({ 
			name: name, 
			timestamp: Math.floor(Date.now() / 1000) 
		}).then(() => {
			return res.json({ success: true })	
		})
	})
}


module.exports = albumsController