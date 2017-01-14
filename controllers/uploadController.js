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

	if(config.TOKEN !== '')
		if(req.headers.auth !== config.TOKEN)
			return res.status(401).send('not-authorized')

	let gallery = req.headers.gallery
	
	upload(req, res, function (err) {
		if (err) {
			console.error(err)
			return res.json({ error: err })
		}

		db.table('files').insert({
			file: req.file.filename,
			galleryid: gallery
		}).then(() => {
			return res.json({
				'url': config.uploads.basedomain + req.file.filename
			})
		})
		
	})

}

module.exports = uploadsController