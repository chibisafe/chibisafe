const config = require('../config.js')
const routes = require('express').Router()
const uploadController = require('../controllers/uploadController')
const galleryController = require('../controllers/galleryController')

routes.get  ('/info', (req, res, next) => {
	if(!config.privacy.public)
		if(!config.privacy.IPs.includes(req.ip)) return res.status(401).send('not-authorized')

	return res.json({
		maxFileSize: config.uploads.maxsize.slice(0, -2),
		urlPrefix: config.uploads.prefix
	})
})

routes.post ('/upload', (req, res, next) => uploadController.upload(req, res, next))
routes.get  ('/gallery', (req, res, next) => galleryController.list(req, res, next))
routes.get  ('/gallery/test', (req, res, next) => galleryController.test(req, res, next))

module.exports = routes