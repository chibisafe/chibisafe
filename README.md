![loli-safe](https://i.kanacchi.moe/EW7C.png)   
# loli-safe
Pomf-like file uploading service, but way better.

---
1. Clone
2. Rename `config.sample.js` to `config.js`
4. Modify port, basedomain and privacy options if desired
3. run `npm install` to install all dependencies
5. run `pm2 start lolisafe.js` or `node lolisafe.js` to start the service

### Token
This service supports running both as public and private. The only difference is that one needs a token to upload and the other one doesn't. If you want it to be public so anyone can upload files either from the website or API, just set the option `private: false` in the `config.js` file.

In case you want to run it privately, you should set `private: true` and 2 tokens will be generated when you first run the service. This tokens are a client and admin token respectively.

The client token should be sent with every upload request to the service to validate an upload, making it so that only people with access to said token can upload files to the service.
The admin token is used to access the admin dashboard. This one is generated regardless of how the service is running (public or private) because it grants you access to the dashboard where you can see all uploaded files, create albums to sort out stuff and change your access tokens.

When you first run the service both tokens will be displayed on the console so you can copy and save them. Keep in mind that the tokens are nothing more than random generated strings so you can always change them for something easy to remember, acting more like a password than a token. But since the token is sent to the server with each request either to upload files or access the admin dashboard, I suggest keeping them random.

---
## Using loli-safe
Once the service starts you can start hitting the upload endpoint at `/api/upload` with any file. If you're using the frontend to do so then you are pretty much set, but if using the API to upload make sure the form name is set to `files[]` and the form type to `multipart/form-data`. If the service is running in private mode, dont forget to send a header of type `auth: YOUR-CLIENT-TOKEN` to validate the request.

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
