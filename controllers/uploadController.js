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
}).single('file')

uploadsController.upload = function(req, res, next){

	if(config.TOKEN === true)
		if(req.headers.auth !== config.clientToken)
			return res.status(401).send('not-authorized')

	let gallery = req.headers.gallery
	
	upload(req, res, function (err) {
		if (err) {
			console.error(err)
			return res.json({ 
				success: false,
				description: err
			})
		}

		db.table('files').insert({
			file: req.file.filename,
			original: req.file.originalname,
			type: req.file.mimetype,
			size: req.file.size,
			ip: req.ip,
			galleryid: gallery,
			created_at: Math.floor(Date.now() / 1000)
		}).then(() => {
			return res.json({
				success: true,
				files: [
					{
						name: req.file.filename,
						size: req.file.size,
						url: config.basedomain + req.file.filename
					}
				]
			})
		})
	})

}

uploadsController.list = function(req, res){

	if(config.TOKEN === true)
		if(req.headers.auth !== config.clientToken)
			return res.status(401).send('not-authorized')

	db.table('files').then((files) => {

		for(let file of files){
			file.file = config.basedomain + config.uploads.prefix + file.file
			file.ext = file.file.split('.').pop()

			file.date = new Date(file.created_at * 1000)
			file.date = file.date.getFullYear() + '-' + file.date.getMonth() + '-' + file.date.getDate() + ' ' + (file.date.getHours() < 10 ? '0' : '') + file.date.getHours() + ':' + (file.date.getMinutes() < 10 ? '0' : '') + file.date.getMinutes() + ':' + (file.date.getSeconds() < 10 ? '0' : '') + file.date.getSeconds()
			

		}

		return res.json(files)
	})
}

module.exports = uploadsController