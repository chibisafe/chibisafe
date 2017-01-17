const config = require('../config.js')
const routes = require('express').Router()
const uploadController = require('../controllers/uploadController')
const galleryController = require('../controllers/galleryController')

routes.get ('/check', (req, res, next) => {
	return res.json({ private: config.private })
})

routes.get ('/verify', (req, res, next) => {
	let type = req.headers.type
	let token = req.headers.token

	if(type === undefined) return res.json({ success: false, description: 'No type provided.' })
	if(token === undefined) return res.json({ success: false, description: 'No token provided.' })
	if(type !== 'client' && type !== 'admin') return res.json({ success: false, description: 'Wrong type provided.' })

	if(type === 'client'){
		if(token !== config.clientToken) return res.json({ success: false, description: 'Token mismatch.' })
		return res.json({ success: true })
	}

	if(type === 'admin'){
		if(token !== config.adminToken) return res.json({ success: false, description: 'Token mismatch.' })
		return res.json({ success: true })
	}

	return res.json({ success: false, description: '(╯°□°）╯︵ ┻━┻' })

})

routes.get('/info', (req, res, next) => {

	if(config.private === true)
		if(req.headers.auth !== config.clientToken)
			return res.status(401).send('not-authorized')
		
	return res.json({
		maxFileSize: config.uploads.maxsize.slice(0, -2)
	})
})

routes.get  ('/uploads', (req, res, next) => uploadController.list(req, res))
routes.post ('/upload', (req, res, next) => uploadController.upload(req, res, next))
routes.get  ('/gallery', (req, res, next) => galleryController.list(req, res, next))
routes.get  ('/gallery/test', (req, res, next) => galleryController.test(req, res, next))

module.exports = routes
