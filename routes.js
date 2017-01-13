const routes            	= require('express').Router()
const uploadController    	= require('./controllers/uploadController')

routes.post ('/upload', (req, res, next) => uploadController.upload(req, res, next))

module.exports = routes