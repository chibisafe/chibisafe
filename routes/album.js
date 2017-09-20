const config = require('../config.js')
const routes = require('express').Router()
const db = require('knex')(config.database)
const path = require('path')
const utils = require('../controllers/utilsController.js')

routes.get('/a/:identifier', (req, res, next) => {

	let identifier = req.params.identifier
	if (identifier === undefined) return res.status(401).json({ success: false, description: 'No identifier provided' })

	db.table('albums')
	.where('identifier', identifier)
	.then((albums) => {
		if (albums.length === 0) return res.json({ success: false, description: 'Album not found' })

		let title = albums[0].name
		db.table('files').select('name').where('albumid', albums[0].id).orderBy('id', 'DESC').then((files) => {

			let thumb = ''
			let basedomain = req.get('host')
			for (let domain of config.domains)
				if (domain.host === req.get('host'))
					if (domain.hasOwnProperty('resolve'))
						basedomain = domain.resolve

			for (let file of files) {
				file.file = basedomain + '/' + file.name

				let ext = path.extname(file.name).toLowerCase()
				if (utils.extensions.includes(ext)) {
					file.thumb = basedomain + '/thumbs/' + file.name.slice(0, -ext.length) + '.png'

					/*
						If thumbnail for album is still not set, do it.
						A potential improvement would be to let the user upload a specific image as an album cover
						since embedding the first image could potentially result in nsfw content when pasting links.
					*/

					if (thumb === '') {
						thumb = file.thumb
					}

					file.thumb = `<img src="${file.thumb}"/>`
				} else {
					file.thumb = `<h1 class="title">.${ext}</h1>`
				}
			}

			return res.render('album', {
				layout: false,
				title: title,
				count: files.length,
				thumb: files[0].
				files
			})
		}).catch(function(error) { console.log(error); res.json({ success: false, description: 'error' }) })
	}).catch(function(error) { console.log(error); res.json({ success: false, description: 'error' }) })
})

module.exports = routes
