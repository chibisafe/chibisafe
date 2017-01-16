module.exports = {

	/* 
	NOTES:
		All folders specified on this file will be created automagically.
		Ideally the only options you should change are port and basedomain.
	*/

	// Your base domain where the app is running. Remember to finish it with '/'
	basedomain: 'https://i.kanacchi.moe/',

	// Port on which to run the server
	port: 9999,

	// Uploads config
	uploads: {

		// If prefix is set, it will be appended at the end of basedomain. Remember to finish it with `/`
		// Ex: https://i.kanacchi.moe/prefix/k4n4.png
		// Leave blank to use the basedomain.
		prefix: '',

		// Folder where images should be stored
		folder: 'uploads',

		// Max file size allowed
		maxsize: '512MB',

		// The length of the random generated name for the uploaded files
		fileLength: 32,
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
