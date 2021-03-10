const axios = require('axios');
const instance = axios.create({
	baseURL: 'http://localhost:5000',
	headers: {
		common: {
			accept: 'application/vnd.toshokan.json'
		}
	}
});

module.exports.axios = instance;
