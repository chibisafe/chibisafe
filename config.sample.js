module.exports = {

	/*
		If set to true the user will need to specify the auto-generated token
		on each API call, meaning random strangers wont be able to use the service
		unless they have the token loli-safe provides you with.
		If it's set to false, then upload will be public for anyone to use.
	*/
	private: true,
	
	// If true, users will be able to create accounts and access their uploaded files
	enableUserAccounts: true,
	
	// The registered domain where you will be serving the app. Use IP if none.
	domains: [

		/*
			You need to specify the base domain where loli-self is running
			and how should it resolve the URL for uploaded files. For example:
		*/

		// Files will be served at http(s)://i.kanacchi.moe/Fxt0.png
		{ host: 'kanacchi.moe', resolve: 'https://i.kanacchi.moe'},

		// Files will be served at https://my.kanacchi.moe/loli-self/files/Fxt0.png
		{ host: 'kanacchi.moe', resolve: 'https://my.kanacchi.moe/loli-self/files' }

	],

	// Port on which to run the server
	port: 9999,

	// Pages to process for the frontend
	pages: ['home', 'auth', 'dashboard', 'faq'],

	// Add file extensions here which should be blocked
	blockedExtensions: [
		'.exe',
		'.bat',
		'.cmd',
		'.msi',
		'.sh',
		'.iso'
	],

	// Uploads config
	uploads: {

		// Folder where images should be stored
		folder: 'uploads',

		// Max file size allowed. Needs to be in MB
		// Note: When maxSize is greater than 1 MiB,
		// you must set the client_max_body_size
		// to the same as maxSize.
		maxSize: '512MB',

		// The length of the random generated name for the uploaded files
		fileLength: 32,

		// NOTE: Thumbnails are only for the admin panel and they require you
		// to install a separate binary called graphicsmagick (http://www.graphicsmagick.org)
		// for images and FFmpeg (https://ffmpeg.org/) for video files
		generateThumbnails: false
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
