![loli-safe](https://lolisafe.moe/images/logo.png)   
# lolisafe, a small safe worth protecting.

## Sites using loli-safe
- [lolisafe.moe](https://lolisafe.moe): A small safe worth protecting.
- [safe.moe](https://safe.moe): The world most ~~un~~safe pomf clone
- Feel free to add yours here.

## What's new in v2.2.0
- Creation of public link for sharing a gallery
- Ability to add your own html files without making git dirty (Check [this commit](https://github.com/WeebDev/loli-safe/commit/18c66d27fb580ed0f847f11525d2d2dca0fda2f4))
- Thumbnail creation for .webm and .mp4 (Thanks to [PascalTemel](https://github.com/PascalTemel))
- Changed how duplicate files work (Check [this issue for more info](https://github.com/WeebDev/loli-safe/issues/8))

If you're upgrading from a previous version, create a `migrate.js` file on the root folder with the following code and run it only once:

```js
const config = require('./config.js')
const db = require('knex')(config.database)
const randomstring = require('randomstring')

db.schema.table('albums', function (table) {
	table.string('identifier')
}).then(() => {
	db.table('albums').then((albums) => {
		for(let album of albums)
			db.table('albums').where('id', album.id).update('identifier', randomstring.generate(8)).then(() => {})
	})
})
```

## Running
1. Clone
2. Rename `config.sample.js` to `config.js`
4. Modify port, basedomain and privacy options if desired
3. run `npm install` to install all dependencies
5. run `pm2 start lolisafe.js` or `node lolisafe.js` to start the service

## Getting started
This service supports running both as public and private. The only difference is that one needs a token to upload and the other one doesn't. If you want it to be public so anyone can upload files either from the website or API, just set the option `private: false` in the `config.js` file. In case you want to run it privately, you should set `private: true`.

Upon running the service for the first time, it's gonna create a user account with the username `root` and password `root`. This is your admin account and you should change the password immediately. This account will let you manage all uploaded files and remove any if necessary.

If you set `enableUserAccounts: true`, people will be able to create accounts on the service to keep track of their uploaded files and create albums to upload stuff to, pretty much like imgur does, but only through the API. Every user account has a token that the user can use to upload stuff through the API. You can find this token on the section called `Change your token` on the administration dashboard, and if it gets leaked or compromised you can renew it by clicking the button titled `Request new token`.

## Using loli-safe
Once the service starts you can start hitting the upload endpoint at `/api/upload` with any file. If you're using the frontend to do so then you are pretty much set, but if using the API to upload make sure the form name is set to `files[]` and the form type to `multipart/form-data`. If the service is running in private mode, dont forget to send a header of type `token: YOUR-CLIENT-TOKEN` to validate the request.

A sample of the returning json from the endpoint can be seen below:
```json
{
	"name": "EW7C.png",
	"size": "71400",
	"url": "https://i.kanacchi.moe/EW7C.png"
}
```

To make it easier and better than any other service, you can download [our Chrome extension](https://chrome.google.com/webstore/detail/loli-safe-uploader/enkkmplljfjppcdaancckgilmgoiofnj) that will let you configure your hostname and tokens, so that you can simply `right click` -> `send to loli-safe` to any image/audio/video file on the web.

Because of how nodejs apps work, if you want it attached to a domain name you will need to make a reverse proxy for it. Here is a tutorial [on how to do this with nginx](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04). Keep in mind that this is only a requirement if you want to access your loli-safe service by using a domain name (ex: https://i.kanacchi.moe), otherwise you can use the service just fine by accessing it from your server's IP.

If you choose to use a domain name and thus nginx, you should add the following directive into your location block with the limit you want to set on uploaded file's size:
`client_max_body_size 512M;`

## Author

**loli-safe** © [Pitu](https://github.com/Pitu), Released under the [MIT](https://github.com/WeebDev/loli-safe/blob/master/LICENSE) License.<br>
Authored and maintained by Pitu.

> [lolisafe.moe](https://lolisafe.moe) · GitHub [@Pitu](https://github.com/Pitu) · Twitter [@kanaadeko](https://twitter.com/kanaadeko)
