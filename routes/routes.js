const config = require('../config.js')
const routes = require('express').Router()
const path = require('path')

let options = {
	root: 'pages/',
	dotfiles: 'deny',
	headers: {
		'x-timestamp': Date.now(),
		'x-sent': true
	}
}

routes.get('/', (req, res) => {

	res.sendFile('home.html', options, function (err) {
		if (err) {
			console.log(err)
			res.status(err.status).end()
		}
	})

})

routes.get('/panel', function (req, res, next) {

	res.sendFile('panel.html', options, function (err) {
		if (err) {
			console.log(err)
			res.status(err.status).end()
		}
	})

})

module.exports = routes