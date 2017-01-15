const config = require('../config.js')
const routes = require('express').Router()
const path = require('path')

routes.get('/', (req, res) => {

	let options = {
		root: 'pages/',
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	}

	res.sendFile('home.html', options, function (err) {
		if (err) {
			console.log(err)
			res.status(err.status).end()
		} else {
			console.log('Sent: home.html')
		}
	})

})

routes.get('/admin', function (req, res, next) {
	
	let options = {
		root: 'pages/admin/',
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	}

	res.sendFile('index.html', options, function (err) {
		if (err) {
			console.log(err)
			res.status(err.status).end()
		} else {
			console.log('Sent: index.html')
		}
	})

})

routes.get('/admin/:name', function (req, res, next) {

	let options = {
		root: 'pages/admin/',
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	}

	let fileName = req.params.name

	res.sendFile(fileName, options, function (err) {
		if (err) {
			console.log(err)
			res.status(err.status).end()
		} else {
			console.log('Sent:', fileName)
		}
	})

})

/*
routes.get('/', (req, res) => {
	res.sendFile('pages/home.html')
})

routes.get('/dashboard', (req, res, next) => {

	if(config.TOKEN !== '')
		if(req.headers.auth !== config.TOKEN)
			return res.status(401).send('not-authorized')
	
	return res.sendFile('pages/home.html')

})
*/

module.exports = routes