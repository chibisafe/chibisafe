const path = require('path')
const config = require('../config.js')
const multer  = require('multer')
const randomstring = require('randomstring')
const db = require('knex')(config.database)

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
	limits: { fileSize: config.uploads.maxsize }
}).array('files[]')

uploadsController.upload = function(req, res, next){

	if(config.private === true)
		if(req.headers.auth !== config.clientToken)
			return res.status(401).send('not-authorized')

	let album = req.headers.album
	
	upload(req, res, function (err) {
		if (err) {
			console.error(err)
			return res.json({ 
				success: false,
				description: err
			})
		}

		let files = []
		req.files.forEach(function(file) {
			files.push({
				name: file.filename, 
				original: file.originalname,
				type: file.mimetype,
				size: file.size, 
				ip: req.ip,
				albumid: album,
				created_at: Math.floor(Date.now() / 1000)
			})
		})

		db.table('files').insert(files).then(() => {
			
			res.json({
				success: true,
				files: files.map(file => {
					return {
						name: file.name,
						size: file.size,
						url: config.basedomain + file.name
					}
				})
			})

		})
	})

}

uploadsController.list = function(req, res){

	if(req.headers.auth !== config.adminToken)
		return res.status(401).send('not-authorized')

	db.table('files').then((files) => {

		for(let file of files){
			file.file = config.basedomain + config.uploads.prefix + file.name
			file.ext = file.name.split('.').pop()

			file.date = new Date(file.created_at * 1000)
			file.date = file.date.getFullYear() + '-' + file.date.getMonth() + '-' + file.date.getDate() + ' ' + (file.date.getHours() < 10 ? '0' : '') + file.date.getHours() + ':' + (file.date.getMinutes() < 10 ? '0' : '') + file.date.getMinutes() + ':' + (file.date.getSeconds() < 10 ? '0' : '') + file.date.getSeconds()
		}

		return res.json(files)
	})
}

module.exports = uploadsController