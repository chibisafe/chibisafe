const config = require('../config.js')
const db = require('knex')(config.database)

let tokenController = {}

tokenController.verify = function(req, res, next){
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
}

module.exports = tokenController