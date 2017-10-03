const path = require('path')
const config = require('../config.js')
const fs = require('fs')
const gm = require('gm')
const ffmpeg = require('fluent-ffmpeg')

const utilsController = {}
utilsController.imageExtensions = ['.jpg', '.jpeg', '.bmp', '.gif', '.png']
utilsController.videoExtensions = ['.webm', '.mp4', '.wmv', '.avi', '.mov']

utilsController.getPrettyDate = function(date) {
	return date.getFullYear() + '-'
		+ (date.getMonth() + 1) + '-'
		+ date.getDate() + ' '
		+ (date.getHours() < 10 ? '0' : '')
		+ date.getHours() + ':'
		+ (date.getMinutes() < 10 ? '0' : '')
		+ date.getMinutes() + ':'
		+ (date.getSeconds() < 10 ? '0' : '')
		+ date.getSeconds()
}

utilsController.generateThumbs = function(file, basedomain) {
	if (config.uploads.generateThumbnails !== true) return
	const ext = path.extname(file.name).toLowerCase()

	let thumbname = path.join(__dirname, '..', config.uploads.folder, 'thumbs', file.name.slice(0, -ext.length) + '.png')
	fs.access(thumbname, (err) => {
		if (err && err.code === 'ENOENT') {
			if (utilsController.videoExtensions.includes(ext)) {
				ffmpeg(path.join(__dirname, '..', config.uploads.folder, file.name))
					.thumbnail({
						timestamps: [0],
						filename: '%b.png',
						folder: path.join(__dirname, '..', config.uploads.folder, 'thumbs'),
						size: '200x?'
					})
					.on('error', (error) => {
						console.log('Error - ', error.message)
					})
			} else {
				let size = {
					width: 200,
					height: 200
				}
				gm(path.join(__dirname, '..', config.uploads.folder, file.name))
					.resize(size.width, size.height + '>')
					.gravity('Center')
					.extent(size.width, size.height)
					.background('transparent')
					.write(thumbname, (error) => {
						if (error) console.log('Error - ', error)
					})
			}
		}
	})
}

module.exports = utilsController
