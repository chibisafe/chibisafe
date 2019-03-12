![lolisafe](https://lolisafe.moe/8KFePddY.png)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/kanadeko/Kuro/master/LICENSE)
[![Chat / Support](https://img.shields.io/badge/Chat%20%2F%20Support-discord-7289DA.svg?style=flat-square)](https://discord.gg/5g6vgwn)
[![Support me](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.herokuapp.com%2Fpitu&style=flat-square)](https://www.patreon.com/pitu)
[![Support me](https://img.shields.io/badge/Support-Buy%20me%20a%20coffee-yellow.svg?style=flat-square)](https://www.buymeacoffee.com/kana)

### Pre-requisites
This guide asumes a lot of things, including that you know your way around linux, nginx and internet in general.

- Decently updated version of linux
- `node` package installed and at least at version 10
- `build-essential` package installed to build some dependencies
- `ffmpeg` package installed if you want thumbnails
- `yarn` package installed. If you'd like to use npm instead change `package.json` accordingly
- A database, postgresql preferably. You can also fall back to sqlite3 by default.

### Installing

1. Clone the repository and `cd` into it
2. Run `yarn install`
3. Run `yarn setup`
4. Run `yarn migrate`
5. Run `yarn seed`

Lolisafe is now installed, configured and ready. Now you need to serve it to the public by using a domain name.

6. Check the [nginx](docs/nginx.md) file for a sample configuration that has every step to run lolisafe securely on production.

After you finish setting up nginx, you need to start lolisafe by using pm2. If you want to use something else, figure out how. (More info on why pm2 [here](docs/pm2.md))

7. Run `pm2 start pm2.json`:
8. Profit

### Cloudflare

If you want to run your site through CloudFlare because of the obvious advantages it has, lolisafe has your back. Unless you manually modify the `.env` file, uploads through the website will be uploaded in chunks thus bypassing CloudFlare's 100mb upload limit per file.

## Author

**lolisafe** © [Pitu](https://github.com/Pitu), Released under the [MIT](https://github.com/WeebDev/lolisafe/blob/master/LICENSE) License.<br>
Authored and maintained by Pitu.

> [lolisafe.moe](https://lolisafe.moe) · GitHub [@Pitu](https://github.com/Pitu)
