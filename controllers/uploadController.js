const path = require('path')
const config = require('../config.js')
const multer  = require('multer')
const randomstring = require('randomstring')
const db = require('knex')(config.database)
const crypto = require('crypto')
const fs = require('fs')

let uploadsController = {}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './' + config.uploads.folder + '/')
	},
	filename: function (req, file, cb) {
		cb(null, randomstring.generate(config.uploads.fileLength) + path.extname(file.originalname))
	}
})

const upload = multer({
	storage: storage,
	limits: { fileSize: config.uploads.maxSize }
}).array('files[]')

uploadsController.upload = function(req, res, next){

	if(config.private === true)
		if(req.headers.auth !== config.clientToken)
			return res.status(401).json({ success: false, description: 'not-authorized'})

	let album = req.params.albumid
	
	if(album !== undefined)
		if(req.headers.adminauth !== config.adminToken)
			return res.status(401).json({ success: false, description: 'not-authorized'})
	
	upload(req, res, function (err) {
		if (err) {
			console.error(err)
			return res.json({ 
				success: false,
				description: err
			})
		}

		if(req.files.length === 0) return res.json({ success: false, description: 'no-files' })

		let files = []
		let existingFiles = []
		let iteration = 1

		req.files.forEach(function(file) {

			// Check if the file exists by checking hash and size
			let hash = crypto.createHash('md5')
			let stream = fs.createReadStream('./' + config.uploads.folder + '/' + file.filename)

			stream.on('data', function (data) {
				hash.update(data, 'utf8')
			})

			stream.on('end', function () {
				let fileHash = hash.digest('hex') // 34f7a3113803f8ed3b8fd7ce5656ebec

				db.table('files').where({
					hash: fileHash,
					size: file.size
				}).then((dbfile) => {

					if(dbfile.length !== 0){
						uploadsController.deleteFile(file.filename).then(() => {}).catch((e) => console.error(e))
						existingFiles.push(dbfile[0])
					}else{
						files.push({
							name: file.filename, 
							original: file.originalname,
							type: file.mimetype,
							size: file.size, 
							hash: fileHash,
							ip: req.ip,
							albumid: album,
							timestamp: Math.floor(Date.now() / 1000)
						})
					}

					if(iteration === req.files.length)
						return uploadsController.processFilesForDisplay(req, res, files, existingFiles)
					iteration++
				})

			})

		})

	})

}

uploadsController.processFilesForDisplay = function(req, res, files, existingFiles){

	let basedomain = req.get('host')
	for(let domain of config.domains)
		if(domain.host === req.get('host'))
			if(domain.hasOwnProperty('resolve'))
				basedomain = domain.resolve

	if(files.length === 0){
		return res.json({
			success: true,
			files: existingFiles.map(file => {
				return {
					name: file.name,
					size: file.size,
					url: 'http://' + basedomain + '/' + file.name
				}
			})
		})
	}

	db.table('files').insert(files).then(() => {

		for(let efile of existingFiles) files.push(efile)

		res.json({
			success: true,
			files: files.map(file => {
				return {
					name: file.name,
					size: file.size,
					url: 'http://' + basedomain + '/' + file.name
				}
			})
		})

	}).catch(function(error) { console.log(error); res.json({success: false, description: 'error'}) })
}

uploadsController.delete = function(req, res){

	if(req.headers.auth !== config.adminToken)
		return res.status(401).json({ success: false, description: 'not-authorized'})

	let id = req.body.id
	if(id === undefined || id === '')
		return res.json({ success: false, description: 'No file specified' })

	db.table('files').where('id', id).then((file) => {

		uploadsController.deleteFile(file[0].name).then(() => {
			db.table('files').where('id', id).del().then(() =>{
				return res.json({ success: true })
			}).catch(function(error) { console.log(error); res.json({success: false, description: 'error'}) })
		}).catch((e) => {
			return res.json({ success: false, description: e.toString() })
		})

	}).catch(function(error) { console.log(error); res.json({success: false, description: 'error'}) })
	
}

uploadsController.deleteFile = function(file){

	return new Promise(function(resolve, reject){
		fs.stat('./' + config.uploads.folder + '/' + file, function (err, stats) {
			if (err) { return reject(err) }
			fs.unlink('./' + config.uploads.folder + '/' + file, function(err){
				if (err) { return reject(err) }
				return resolve()
			})
		})
	})

}

uploadsController.list = function(req, res){

	if(req.headers.auth !== config.adminToken)
		return res.status(401).json({ success: false, description: 'not-authorized'})

	let offset = req.params.page
	if(offset === undefined) offset = 0

	db.table('files')
	.where(function(){
		if(req.params.id === undefined)
			this.where('id', '<>', '')
		else
			this.where('albumid', req.params.id)
	})
	.orderBy('id', 'DESC')
	.limit(25)
	.offset(25 * offset)
	.then((files) => {
		db.table('albums').then((albums) => {

			let basedomain = req.get('host')
			for(let domain of config.domains)
				if(domain.host === req.get('host'))
					if(domain.hasOwnProperty('resolve'))
						basedomain = domain.resolve

			for(let file of files){
				file.file = 'http://' + basedomain + '/' + file.name
				file.date = new Date(file.timestamp * 1000)
				file.date = file.date.getFullYear() + '-' + (file.date.getMonth() + 1) + '-' + file.date.getDate() + ' ' + (file.date.getHours() < 10 ? '0' : '') + file.date.getHours() + ':' + (file.date.getMinutes() < 10 ? '0' : '') + file.date.getMinutes() + ':' + (file.date.getSeconds() < 10 ? '0' : '') + file.date.getSeconds()

				file.album = ''
				
				if(file.albumid !== undefined)
					for(let album of albums)
						if(file.albumid === album.id)
							file.album = album.name

			}

			return res.json({
				success: true,
				files
			})
		})

	}).catch(function(error) { console.log(error); res.json({success: false, description: 'error'}) })
}

module.exports = uploadsController