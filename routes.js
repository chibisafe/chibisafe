const routes            	= require('express').Router()
const uploadController    	= require('./controllers/uploadController')
const galleryController      = require('./controllers/galleryController')

routes.post ('/upload', (req, res, next) => uploadController.upload(req, res, next))
routes.get  ('/gallery', (req, res, next) => galleryController.list(req, res, next))
routes.get  ('/gallery/test', (req, res, next) => galleryController.test(req, res, next))

module.exports = routes