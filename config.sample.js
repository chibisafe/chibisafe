module.exports = {

	// Port on which to run the server
	port: 9999,

	// Upload restrictions
	privacy: {

		// Is the service public? If so, anyone with the URL can upload files
		public: false,

		// If not, which IP's should be able to access?
		IPs: [
			'::1',
			'127.0.0.1'
		]
	},

	// Uploads config
	uploads: {

		// Folder where images should be stored
		folder: 'uploads',

		// Max file size allowed
		maxsize: '512MB'
	},

	// Folder where to store logs
	logsFolder: 'logs',

	// The length of the random generated name for the uploaded files
	fileLength: 4,

	// The following values shouldn't be touched
	database: {
		client: 'sqlite3',
		connection: {
			filename: './db'
		},
		useNullAsDefault: true
	}
}