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

		// Files will be served at http(s)://i.kanacchi.moe/Fxt0.png
		{ host: 'i.kanacchi.moe' },

		// Files will be served at http(s)://my.kanacchi.moe/loli-self/files/Fxt0.png
		{ host: 'my.kanacchi.moe', resolve: 'https://my.kanacchi.moe/loli-self/files' },

		// Files will be served at http://localhost:9999/Fxt0.png
		{ domain: 'localhost:9999' }

	],

	// Port on which to run the server
	port: 9999,

	// Uploads config
	uploads: {

		// Folder where images should be stored
		folder: 'uploads',

		// Max file size allowed. Needs to be in MB
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
