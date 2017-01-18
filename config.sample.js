module.exports = {

	/*
		If set to true the user will need to specify the auto-generated token
		on each API call, meaning random strangers wont be able to use the service
		unless they have the token loli-safe provides you with.

		If it's set to false, then upload will be public for anyone to use.
	*/
	private: true,
	
	// The registered domain where you will be serving the app. Use IP if none.
	domains: [

		// Files will be served at https://i.kanacchi.moe/file.png
		{ base: 'https://i.kanacchi.moe/', prefix: ''},

		// Files will be served at http://localhost:9999/files/file.png
		{ base: 'http://127.0.0.1:9999/', prefix: 'files/'}
	],

	// Port on which to run the server
	port: 9999,

	// Uploads config
	uploads: {

		// Folder where images should be stored
		folder: 'uploads',

		// Max file size allowed
		maxSize: '512MB',

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
