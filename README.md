# loli-bank
Pomf-like image uploading service, written in NodeJS

---
1. Clone
2. Rename `config.sample.js` to `config.js`
3. Modify port and privacy options if desired
4. run `npm install` to install all dependencies
5. run `node lolisafe.js` to start the service

---
## Using it
After the service is started, you can POST files to /api/upload . The file key needs to be called `file` and it should be a `multipart/form-data` upload, or else it will be disregarded.

This works great with sharex, just like [mixtape.moe](https://mixtape.moe) and [cuntflaps.me](https://cuntflaps.me).
A chrome extension to be able to right click images -> send to safe is in the works.

If you are using nginx, you should set inside your location block the following directive, replacing the number with the one you want set up `client_max_body_size 512M;`

If using apache, you should change the following directives on your config `memory_limit = 512M`
