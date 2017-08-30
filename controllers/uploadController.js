const config = require('../config.js')
const path = require('path')
const multer = require('multer')
const randomstring = require('randomstring')
const db = require('knex')(config.database)
const crypto = require('crypto')
const fs = require('fs')
const utils = require('./utilsController.js')

let uploadsController = {}

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, path.join(__dirname, '..', config.uploads.folder))
	},
	filename: function(req, file, cb) {
		cb(null, randomstring.generate(config.uploads.fileLength) + path.extname(file.originalname))
	}
})

const upload = multer({
	storage: storage,
	limits: { fileSize: config.uploads.maxSize },
	fileFilter: function(req, file, cb) {
		if (config.blockedExtensions !== undefined) {
			if (config.blockedExtensions.some(extension => path.extname(file.originalname).toLowerCase() === extension)) {
				return cb('This file extension is not allowed');
			}
			return cb(null, true);
		}
		return cb(null, true);
	}
}).array('files[]')

uploadsController.upload = function(req, res, next) {

	// Get the token
	let token = req.headers.token

	// If we're running in private and there's no token, error
	if (config.private === true)
		if (token === undefined) return res.status(401).json({ success: false, description: 'No token provided' })

	// If there is no token then just leave it blank so the query fails
	if (token === undefined) token = ''

	db.table('users').where('token', token).then((user) => {

		if(user.length === 0)
			if(config.private === true)
				return res.status(401).json({ success: false, description: 'Invalid token provided' })

		let userid
		if(user.length > 0)
			userid = user[0].id

		// Check if user is trying to upload to an album
		let album
		if (userid !== undefined) {
			album = req.headers.albumid
			if (album === undefined)
				album = req.params.albumid
		}

		db.table('albums').where({ id: album, userid: userid }).then((albums) => {
			if (albums.length === 0) {
				return res.json({
					success: false,
					description: 'Album doesn\'t exist or it doesn\'t belong to the user'
				})
			}

			upload(req, res, function (err) {
				if (err) {
					console.error(err)
					return res.json({
						success: false,
						description: err
					})
				}

				if (req.files.length === 0) return res.json({ success: false, description: 'no-files' })

				let files = []
				let existingFiles = []
				let iteration = 1

				req.files.forEach(function(file) {

					// Check if the file exists by checking hash and size
					let hash = crypto.createHash('md5')
					let stream = fs.createReadStream(path.join(__dirname, '..', config.uploads.folder, file.filename))

					stream.on('data', function (data) {
						hash.update(data, 'utf8')
					})

					stream.on('end', function () {
						let fileHash = hash.digest('hex')

						db.table('files')
						.where(function() {
							if (userid === undefined)
								this.whereNull('userid')
							else
								this.where('userid', userid)
						})
						.where({
							hash: fileHash,
							size: file.size
						}).then((dbfile) => {

							if (dbfile.length !== 0) {
								uploadsController.deleteFile(file.filename).then(() => {}).catch((e) => console.error(e))
								existingFiles.push(dbfile[0])
							} else {
								files.push({
									name: file.filename,
									original: file.originalname,
									type: file.mimetype,
									size: file.size,
									hash: fileHash,
									ip: req.ip,
									albumid: album,
									userid: userid,
									timestamp: Math.floor(Date.now() / 1000)
								})
							}

							if (iteration === req.files.length)
								return uploadsController.processFilesForDisplay(req, res, files, existingFiles)
							iteration++
						}).catch(function(error) { console.log(error); res.json({ success: false, description: 'error' }) })
					})
				})
			})
		})
	}).catch(function(error) { console.log(error); res.json({ success: false, description: 'error' }) })
}

uploadsController.processFilesForDisplay = function(req, res, files, existingFiles) {

	let basedomain = req.get('host')
	for (let domain of config.domains)
		if (domain.host === req.get('host'))
			if (domain.hasOwnProperty('resolve'))
				basedomain = domain.resolve

	if (files.length === 0) {
		return res.json({
			success: true,
			files: existingFiles.map(file => {
				return {
					name: file.name,
					size: file.size,
					url: basedomain + '/' + file.name
				}
			})
		})
	}

	db.table('files').insert(files).then(() => {

		for (let efile of existingFiles) files.push(efile)

		res.json({
			success: true,
			files: files.map(file => {
				return {
					name: file.name,
					size: file.size,
					url: basedomain + '/' + file.name
				}
			})
		})

		for (let file of files) {
			let ext = path.extname(file.name).toLowerCase()
			if (utils.extensions.includes(ext)) {
				file.thumb = basedomain + '/thumbs/' + file.name.slice(0, -ext.length) + '.png'
				utils.generateThumbs(file)
			}
		}

	}).catch(function(error) { console.log(error); res.json({ success: false, description: 'error' }) })
}

uploadsController.delete = function(req, res) {

	let token = req.headers.token
	if (token === undefined) return res.status(401).json({ success: false, description: 'No token provided' })

	let id = req.body.id
	if (id === undefined || id === '')
		return res.json({ success: false, description: 'No file specified' })

	db.table('users').where('token', token).then((user) => {
		if (user.length === 0) return res.status(401).json({ success: false, description: 'Invalid token' })

		db.table('files')
		.where('id', id)
		.where(function() {
			if (user[0].username !== 'root')
				this.where('userid', user[0].id)
		})
		.then((file) => {

			uploadsController.deleteFile(file[0].name).then(() => {
				db.table('files').where('id', id).del().then(() => {
					return res.json({ success: true })
				}).catch(function(error) { console.log(error); res.json({ success: false, description: 'error' }) })
			}).catch((e) => {
				console.log(e.toString())
				db.table('files').where('id', id).del().then(() => {
					return res.json({ success: true })
				}).catch(function(error) { console.log(error); res.json({ success: false, description: 'error' }) })
			})

		}).catch(function(error) { console.log(error); res.json({ success: false, description: 'error' }) })
	}).catch(function(error) { console.log(error); res.json({ success: false, description: 'error' }) })
}

uploadsController.deleteFile = function(file) {

	return new Promise(function(resolve, reject) {
		fs.stat(path.join(__dirname, '..', config.uploads.folder, file), function(err, stats) {
			if (err) { return reject(err) }
			fs.unlink(path.join(__dirname, '..', config.uploads.folder, file), function(err) {
				if (err) { return reject(err) }
				return resolve()
			})
		})
	})

}

uploadsController.list = function(req, res) {

	let token = req.headers.token
	if (token === undefined) return res.status(401).json({ success: false, description: 'No token provided' })

	db.table('users').where('token', token).then((user) => {
		if (user.length === 0) return res.status(401).json({ success: false, description: 'Invalid token'})

		let offset = req.params.page
		if (offset === undefined) offset = 0

		db.table('files')
		.where(function() {
			if (req.params.id === undefined)
				this.where('id', '<>', '')
			else
				this.where('albumid', req.params.id)
		})
		.where(function() {
			if (user[0].username !== 'root')
				this.where('userid', user[0].id)
		})
		.orderBy('id', 'DESC')
		.limit(25)
		.offset(25 * offset)
		.select('id', 'albumid', 'timestamp', 'name', 'userid')
		.then((files) => {
			db.table('albums').then((albums) => {

				let basedomain = req.get('host')
				for (let domain of config.domains)
					if (domain.host === req.get('host'))
						if (domain.hasOwnProperty('resolve'))
							basedomain = domain.resolve

				let userids = []

				for (let file of files) {
					file.file = basedomain + '/' + file.name
					file.date = new Date(file.timestamp * 1000)
					file.date = utils.getPrettyDate(file.date) // file.date.getFullYear() + '-' + (file.date.getMonth() + 1) + '-' + file.date.getDate() + ' ' + (file.date.getHours() < 10 ? '0' : '') + file.date.getHours() + ':' + (file.date.getMinutes() < 10 ? '0' : '') + file.date.getMinutes() + ':' + (file.date.getSeconds() < 10 ? '0' : '') + file.date.getSeconds()

					file.album = ''

					if (file.albumid !== undefined)
						for (let album of albums)
							if (file.albumid === album.id)
								file.album = album.name

					// Only push usernames if we are root
					if (user[0].username === 'root')
						if (file.userid !== undefined && file.userid !== null && file.userid !== '')
							userids.push(file.userid)

					let ext = path.extname(file.name).toLowerCase()
					if (utils.extensions.includes(ext)) {
						file.thumb = basedomain + '/thumbs/' + file.name.slice(0, -ext.length) + '.png'
						utils.generateThumbs(file)
					}
				}

				// If we are a normal user, send response
				if (user[0].username !== 'root') return res.json({ success: true, files })

				// If we are root but there are no uploads attached to a user, send response
				if (userids.length === 0) return res.json({ success: true, files })

				db.table('users').whereIn('id', userids).then((users) => {
					for (let user of users)
						for (let file of files)
							if (file.userid === user.id)
								file.username = user.username

					return res.json({ success: true, files })
				}).catch(function(error) { console.log(error); res.json({ success: false, description: 'error' }) })
			}).catch(function(error) { console.log(error); res.json({ success: false, description: 'error' }) })
		}).catch(function(error) { console.log(error); res.json({ success: false, description: 'error' }) })
	})
}

module.exports = uploadsController
