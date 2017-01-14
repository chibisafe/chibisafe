module.exports = {

	/* 
	NOTES:
	
		All folders specified on this file will be created automagically.
		Most options shouldn't be touched, and the service should run straight up.

	*/

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
		maxsize: '512MB',

		// The length of the random generated name for the uploaded files
		fileLength: 4,

		// Prefix before linking an uploaded file. Ex: your-domain.com/prefix/k4n4.png
		// Leave blank for no prefix
		prefix: ''
	},

	// Folder where to store logs
	logsFolder: 'logs',

	// The following values shouldn't be touched
	database: {
		client: 'sqlite3',
		connection: {
			filename: './database/db'
		},
		useNullAsDefault: true
	}
}
