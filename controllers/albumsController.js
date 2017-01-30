const config = require('../config.js')
const db = require('knex')(config.database)

let albumsController = {}

albumsController.list = function(req, res, next){
	
	let token = req.headers.token
	if(token === undefined) return res.status(401).json({ success: false, description: 'No token provided' })

	db.table('users').where('token', token).then((user) => {
		if(user.length === 0) return res.status(401).json({ success: false, description: 'Invalid token'})

		let fields = ['id', 'name']

		if(req.params.sidebar === undefined)
			fields.push('timestamp')
		
		db.table('albums').select(fields).where({enabled: 1, userid: user.id}).then((albums) => {
			
			if(req.params.sidebar !== undefined)
				return res.json({ success: true, albums })

			let ids = []
			for(let album of albums){
				album.date = new Date(album.timestamp * 1000)
				album.date = album.date.getFullYear() + '-' + (album.date.getMonth() + 1) + '-' + album.date.getDate() + ' ' + (album.date.getHours() < 10 ? '0' : '') + album.date.getHours() + ':' + (album.date.getMinutes() < 10 ? '0' : '') + album.date.getMinutes() + ':' + (album.date.getSeconds() < 10 ? '0' : '') + album.date.getSeconds()

				ids.push(album.id)
			}

			db.table('files').whereIn('albumid', ids).select('albumid').then((files) => {

				let albumsCount = {}
				
				for(let id of ids)  albumsCount[id] = 0
				for(let file of files) albumsCount[file.albumid] += 1
				for(let album of albums) album.files = albumsCount[album.id]

				return res.json({ success: true, albums })
			}).catch(function(error) { console.log(error); res.json({success: false, description: 'error'}) })
		}).catch(function(error) { console.log(error); res.json({success: false, description: 'error'}) })
	}).catch(function(error) { console.log(error); res.json({success: false, description: 'error'}) })

}

albumsController.create = function(req, res, next){
	
	let token = req.headers.token
	if(token === undefined) return res.status(401).json({ success: false, description: 'No token provided' })

	db.table('users').where('token', token).then((user) => {
		if(user.length === 0) return res.status(401).json({ success: false, description: 'Invalid token'})

		let name = req.body.name
		if(name === undefined || name === '')
			return res.json({ success: false, description: 'No album name specified' })	

		db.table('albums').where({
			name: name,
			enabled: 1,
			userid: user.id
		}).then((album) => {
			if(album.length !== 0) return res.json({ success: false, description: 'There\'s already an album with that name' })	

			db.table('albums').insert({ 
				name: name, 
				enabled: 1,
				userid: user.id,
				timestamp: Math.floor(Date.now() / 1000) 
			}).then(() => {
				return res.json({ success: true })	
			})
		}).catch(function(error) { console.log(error); res.json({success: false, description: 'error'}) })
	}).catch(function(error) { console.log(error); res.json({success: false, description: 'error'}) })

	
}

albumsController.delete = function(req, res, next){
	let token = req.headers.token
	if(token === undefined) return res.status(401).json({ success: false, description: 'No token provided' })

	db.table('users').where('token', token).then((user) => {
		if(user.length === 0) return res.status(401).json({ success: false, description: 'Invalid token'})

		let id = req.body.id
		if(id === undefined || id === '')
			return res.json({ success: false, description: 'No album specified' })

		db.table('albums').where({id: id, userid: user.id}).update({ enabled: 0 }).then(() => {
			return res.json({ success: true })	
		}).catch(function(error) { console.log(error); res.json({success: false, description: 'error'}) })
	}).catch(function(error) { console.log(error); res.json({success: false, description: 'error'}) })
}

albumsController.rename = function(req, res, next){
	let token = req.headers.token
	if(token === undefined) return res.status(401).json({ success: false, description: 'No token provided' })

	db.table('users').where('token', token).then((user) => {
		if(user.length === 0) return res.status(401).json({ success: false, description: 'Invalid token'})

		let id = req.body.id
		if(id === undefined || id === '')
			return res.json({ success: false, description: 'No album specified' })

		let name = req.body.name
		if(name === undefined || name === '')
			return res.json({ success: false, description: 'No name specified' })

		db.table('albums').where({name: name, userid: user.id}).then((results) => {
			if(results.length !== 0) return res.json({ success: false, description: 'Name already in use' })

			db.table('albums').where({id: id, userid: user.id}).update({ name: name }).then(() => {
				return res.json({ success: true })	
			}).catch(function(error) { console.log(error); res.json({success: false, description: 'error'}) })
		}).catch(function(error) { console.log(error); res.json({success: false, description: 'error'}) })
	}).catch(function(error) { console.log(error); res.json({success: false, description: 'error'}) })

}

module.exports = albumsController