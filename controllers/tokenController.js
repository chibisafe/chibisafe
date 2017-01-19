const config = require('../config.js')
const db = require('knex')(config.database)

let tokenController = {}

tokenController.verify = function(req, res, next){
	let type = req.body.type
	let token = req.body.token

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
}

tokenController.list = function(req, res, next){
	if(req.headers.auth !== config.adminToken)
		return res.status(401).json({ success: false, description: 'not-authorized'})

	return res.json({
		clientToken: config.clientToken,
		adminToken: config.adminToken
	})
}

tokenController.change = function(req, res, next){
	if(req.headers.auth !== config.adminToken)
		return res.status(401).json({ success: false, description: 'not-authorized'})

	let type = req.body.type
	let token = req.body.token

	if(type === undefined) return res.json({ success: false, description: 'No type provided.' })
	if(token === undefined) return res.json({ success: false, description: 'No token provided.' })
	if(type !== 'client' && type !== 'admin') return res.json({ success: false, description: 'Wrong type provided.' })

	db.table('tokens').where('name', type).update({ value: token, timestamp: Math.floor(Date.now() / 1000) })
	.then(() => {

		if(type === 'client')
			config.clientToken = token
		else if(type === 'admin')
			config.adminToken = token
		
		res.json({ success: true }) 
	})
}

module.exports = tokenController