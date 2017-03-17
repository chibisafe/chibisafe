const config = require('../config.js')
const db = require('knex')(config.database)
const randomstring = require('randomstring')

let tokenController = {}

tokenController.verify = function(req, res, next) {

	if (req.body.token === undefined) return res.json({ success: false, description: 'No token provided' })
	let token = req.body.token

	db.table('users').where('token', token).then((user) => {
		if (user.length === 0) return res.json({ success: false, description: 'Token mismatch' })
		return res.json({ success: true, username: user[0].username })
	}).catch(function(error) { console.log(error); res.json({ success: false, description: 'error' }) })
	
}

tokenController.list = function(req, res, next) {

	let token = req.headers.token
	if (token === undefined) return res.status(401).json({ success: false, description: 'No token provided' })

	db.table('users').where('token', token).then((user) => {
		if (user.length === 0) return res.json({ success: false, description: 'Token mismatch' })
		return res.json({ success: true, token: token })
	}).catch(function(error) { console.log(error); res.json({ success: false, description: 'error' }) })

}

tokenController.change = function(req, res, next) {

	let token = req.headers.token
	if (token === undefined) return res.status(401).json({ success: false, description: 'No token provided' })

	let newtoken = randomstring.generate(64)

	db.table('users').where('token', token).update({
		token: newtoken,
		timestamp:  Math.floor(Date.now() / 1000)
	}).then(() => {
		res.json({ success: true, token: newtoken })
	}).catch(function(error) { console.log(error); res.json({ success: false, description: 'error' }) })
}

module.exports = tokenController
