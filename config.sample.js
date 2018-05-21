module.exports = {

	/*
		If set to true the user will need to specify the auto-generated token
		on each API call, meaning random strangers wont be able to use the service
		unless they have the token lolisafe provides you with.
		If it's set to false, then upload will be public for anyone to use.
	*/
	private: true,

	// If true, users will be able to create accounts and access their uploaded files
	enableUserAccounts: true,

	/*
		Here you can decide if you want lolisafe to serve the files or if you prefer doing so via nginx.
		The main difference between the two is the ease of use and the chance of analytics in the future.
		If you set it to `true`, the uploaded files will be located after the host like:
			https://lolisafe.moe/yourFile.jpg

		If you set it to `false`, you need to set nginx to directly serve whatever folder it is you are serving your
		downloads in. This also gives you the ability to serve them, for example, like this:
			https://files.lolisafe.moe/yourFile.jpg

		Both cases require you to type the domain where the files will be served on the `domain` key below.
		Which one you use is ultimately up to you.
	*/
	serveFilesWithNode: false,
	domain: 'https://lolisafe.moe',

	// Port on which to run the server
	port: 9999,

	// Pages to process for the frontend
	pages: ['home', 'auth', 'dashboard', 'faq'],

	// Add file extensions here which should be blocked
	blockedExtensions: [
		'.jar',
		'.exe',
		'.msi',
		'.com',
		'.bat',
		'.cmd',
		'.nt',
		'.scr',
		'.ps1',
		'.psm1',
		'.sh',
		'.bash',
		'.bsh',
		'.csh',
		'.bash_profile',
		'.bashrc',
		'.profile'
	],

	// Uploads config
	uploads: {

		// Folder where images should be stored
		folder: 'uploads',

		/*
			Max file size allowed. Needs to be in MB
			Note: When maxSize is greater than 1 MiB, you must set the client_max_body_size to the same as maxSize.
		*/
		maxSize: '512MB',

		// The length of the random generated name for the uploaded files
		fileLength: 32,

		/*
			This option will limit how many times it will try to generate random names
			for uploaded files. If this value is higher than 1, it will help in cases
			where files with the same name already exists (higher chance with shorter file name length).
		*/
		maxTries: 1,

		/*
			NOTE: Thumbnails are only for the admin panel and they require you
			to install a separate binary called graphicsmagick (http://www.graphicsmagick.org)
			for images and ffmpeg (https://ffmpeg.org/) for video files
		*/
		generateThumbnails: false,

		/*
			Allows users to download a .zip file of all files in an album.
			The file is generated when the user clicks the download button in the view
			and is re-used if the album has not changed between download requests
		*/
		generateZips: true
	},

	// Folder where to store logs
	logsFolder: 'logs',

	// The following values shouldn't be touched
	database: {
		client: 'sqlite3',
		connection: { filename: './database/db' },
		useNullAsDefault: true
	}
}
