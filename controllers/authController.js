const config = require('../config.js')
const db = require('knex')(config.database)
const bcrypt = require('bcrypt')
const saltRounds = 10
const randomstring = require('randomstring')

let authController = {}

authController.verify = function(req, res, next){
	let username = req.body.username
	let password = req.body.password

	if(username === undefined) return res.json({ success: false, description: 'No username provided' })
	if(password === undefined) return res.json({ success: false, description: 'No password provided' })

	db.table('users').where('username', username).then((user) => {
		if(user.length === 0) return res.json({ success: false, description: 'Username doesn\'t exist' })

		bcrypt.compare(password, user[0].password, function(err, result) {
			if(result === false) return res.json({ success: false, description: 'Wrong password' })
			return res.json({ success: true, token: user[0].token })
		})
	}).catch(function(error) { console.log(error); res.json({success: false, description: 'error'}) })

}

authController.register = function(req, res, next){

	if(config.enableUserAccounts === false) 
		return res.json({ success: false, description: 'Register is disabled at the moment' })

	let username = req.body.user
	let password = req.body.password

	if(username === undefined) return res.json({ success: false, description: 'No username provided' })
	if(password === undefined) return res.json({ success: false, description: 'No password provided' })

	if(username.length < 6 || username.length > 32)
		return res.json({ success: false, description: 'Username must have 6-32 characters' })
	if(password.length < 6 || password.length > 64)
		return res.json({ success: false, description: 'Password must have 6-64 characters' })

	db.table('users').where('username', username).then((user) => {
		if(user.length !== 0) return res.json({ success: false, description: 'Username already exists' })

		bcrypt.hash(password, saltRounds, function(err, hash) {
			if(err) return res.json({ success: false, description: 'Error generating password hash (╯°□°）╯︵ ┻━┻' })

			let token = randomstring.generate(64)

			db.table('users').insert({
				username: username,
				password: hash,
				token: token
			}).then(() => {
				return res.json({ success: true, token: token})
			}).catch(function(error) { console.log(error); res.json({success: false, description: 'error'}) })
		})

	}).catch(function(error) { console.log(error); res.json({success: false, description: 'error'}) })

}

authController.changePassword = function(req, res, next){

	let token = req.headers.token
	if(token === undefined) return res.status(401).json({ success: false, description: 'No token provided' })

	db.table('users').where('token', token).then((user) => {
		if(user.length === 0) return res.status(401).json({ success: false, description: 'Invalid token'})
		
		let password = req.body.password
		if(password === undefined) return res.json({ success: false, description: 'No password provided' })
		if(password.length < 6 || password.length > 64)
			return res.json({ success: false, description: 'Password must have 6-64 characters' })

		bcrypt.hash(password, saltRounds, function(err, hash) {
			if(err) return res.json({ success: false, description: 'Error generating password hash (╯°□°）╯︵ ┻━┻' })

			db.table('users').where('id', user.id).update({password: hash}).then(() => {
				return res.json({ success: true})
			}).catch(function(error) { console.log(error); res.json({success: false, description: 'error'}) })
		})
	}).catch(function(error) { console.log(error); res.json({success: false, description: 'error'}) })

}

module.exports = authController