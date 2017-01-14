![loli-safe](https://i.kanacchi.moe/R6GE.png)   
# loli-safe
Pomf-like image uploading service, written in NodeJS

---
1. Clone
2. Rename `config.sample.js` to `config.js`
4. Modify port, basedomain and token options if desired
3. run `npm install` to install all dependencies
5. run `pm2 start lolisafe.js` or `node lolisafe.js` to start the service

### Token
This service supports running both as public and private. The only difference is that one needs a token and the other one doesn't. If you want it to be public so anyone can upload files either from the website or API, just leave the token empty on the config file.

But if you want to run it privately, you need to specify a random string, which you'll need to provide in every API call as a header called `auth`.

---
## Using it
Once the service starts, you can start hitting the upload endpoint at `/api/upload`.
When sending a file to it, be sure the form name is set to `file`, and if the app you're using asks, the type of form is `multipart/form-data`. Once the request has been made, if everything goes smoothly you should be receiving a json with the key `url`. Sample:

```json
{
    "url": "https://i.kanacchi.moe/pqkI.png"
}
```

This service works great with apps like ShareX, since it's a lot like [cuntflaps.me](https://cuntflaps.me) or [mixtape.moe](https://mixtape.moe).
A chrome extension to be able to `right click` images -> `send to safe` is in the works.

If you are using nginx, you should set inside your location block the following directive, replacing the number with the one you want set up `client_max_body_size 512M;`
If using apache, you should change the following directives on your config `RLimitMEM 512M`
