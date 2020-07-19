![lolisafe](https://lolisafe.moe/8KFePddY.png)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/kanadeko/Kuro/master/LICENSE)
[![Chat / Support](https://img.shields.io/badge/Chat%20%2F%20Support-discord-7289DA.svg?style=flat-square)](https://discord.gg/5g6vgwn)
[![Support me](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.herokuapp.com%2Fpitu&style=flat-square)](https://www.patreon.com/pitu)
[![Support me](https://img.shields.io/badge/Support-Buy%20me%20a%20coffee-yellow.svg?style=flat-square)](https://www.buymeacoffee.com/kana)

### Attention
If you are upgrading from v3 to v4 (current release) and you want to keep your files and relations please read the [migration guide](docs/migrating.md).

### Pre-requisites
This guide asumes a lot of things, including that you know your way around linux, nginx and internet in general.

- Decently updated version of linux
- `node` version 12+
- `build-essential` package installed to build dependencies
- `ffmpeg` package installed if you want video thumbnails
- `yarn` package installed. If you'd like to use npm instead change `package.json` accordingly
- `pm2` globally installed (`npm i -g pm2`) to keep the service alive at all times.
- A database, postgresql preferably. You can also fall back to sqlite3 which ships by default.

### Installing

1. Clone the repository and `cd` into it
2. Run `yarn install`
3. Run `yarn setup`

Lolisafe is now installed, configured and ready. Now you need to serve it to the public by using a domain name.

6. Check the [nginx](docs/nginx.md) file for a sample configuration that has every step to run lolisafe securely on production.

After you finish setting up nginx, you need to start lolisafe by using pm2. If you want to use something else like forever, ensure that the process spawned from `npm run start` never dies.

7. Run `pm2 start pm2.json`:
8. Profit

## Author

**lolisafe** © [Pitu](https://github.com/Pitu), Released under the [MIT](https://github.com/WeebDev/lolisafe/blob/master/LICENSE) License.<br>
Authored and maintained by Pitu.

> [lolisafe.moe](https://lolisafe.moe) · GitHub [@Pitu](https://github.com/Pitu)
