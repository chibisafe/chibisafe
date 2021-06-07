<p align="center">
  <img width="234" height="376" src="https://lolisafe.moe/xjoghu.png">
</p>

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/kanadeko/Kuro/master/LICENSE)
[![Chat / Support](https://img.shields.io/badge/Chat%20%2F%20Support-discord-7289DA.svg?style=flat-square)](https://discord.gg/5g6vgwn)
[![Support me](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Dpitu%26type%3Dpledges&style=flat-square)](https://www.patreon.com/pitu)
[![Support me](https://img.shields.io/badge/Support-Buy%20me%20a%20coffee-yellow.svg?style=flat-square)](https://www.buymeacoffee.com/kana)

### Attention
If you are upgrading from `v3.x` to `v4.0.0` (lolisafe to chibisafe) and you want to keep your files and relations please read the [migration guide](docs/migrating.md). Keep in mind the migration is a best-effort script and it's recommended to start from scratch. That being said the migration does work but it's up to you to make a backup beforehand in case something goes wrong.

`v4.0.1` changed the hashing algorithm for a better, faster one. So if you are currently running v4.0.0 and decide to update to v4.0.1+ it's in your best interest to rehash all the files your instance is serving. To do this go to the chibisafe root folder and run `node src/api/utils/rehashDatabase.js`. Depending on how many files you have it can take a few minutes or hours, there's a progress bar that will give you an idea.

## What is Chibisafe?
Chibisafe is a file uploader service written in node that aims to to be easy to use and easy to set up. It's mainly intended for images and videos, but it accepts anything you throw at it.
- You can run it in public or private mode, making it so only people with user accounts can upload files as well as controlling if user signup is enabled or not.
- Out of the box support for ShareX configuration letting you upload screenshots and screenrecordings directly to your chibisafe instance.
- Browser extension to be able to right click any image/video from any website and upload it directly to your chibisafe instance.
- Chunk uploads enabled by default to be able to handle big boi files.
- API Key support so you can integrate the service with whatever you desire.
- Albums, tags and Discord-like search function
- User list and control panel

### Docker
If you want to deploy a docker instance instead of manually setting the service up, you can use `docker-composer` with our scripts. [Please refer to the docs here](docs/docker.md)

### Pre-requisites
This guide asumes a whole lot of things, including that you know your way around linux, nginx and internet in general.

- Decently updated version of linux (we recommend Debian)
- `node` version 12.18.2+ (we recommend using [volta.sh](https://volta.sh/) or [n](https://github.com/tj/n))
- `build-essential` package installed in your system to build dependencies
- `ffmpeg` package installed
- `pm2` globally installed (`npm i -g pm2`) to keep the service alive at all times.
	- Alternatively you can use tmux, forever, or whatever you are most familiar with
- `nginx` installed and running

> Note: while Chibisafe does work on Windows, setting it up is not covered in this readme. It's up to you to install the neccessary dependencies 

### Installing

1. Clone the repository and `cd` into it
2. Run `npm i`
3. Run `npm run setup`

Chibisafe is now installed, configured and ready. Now you need to serve it to the public by using a domain name.

4. Check the [nginx](docs/nginx.md) file for a sample configuration that has every step to run chibisafe securely on production.

After you finish setting up nginx, you need to start chibisafe by using pm2. If you want to use something else like forever, ensure that the process spawned from `npm run start` never dies.

5. Run `pm2 start pm2.json`:
6. Profit

### Screenshots
<p align="center">
  <img src="https://lolisafe.moe/73up1d.png">
  <img src="https://lolisafe.moe/q0uctp.png">
  <img src="https://lolisafe.moe/8fi2x6.png">
</p>

## Author

**Chibisafe** © [Pitu](https://github.com/Pitu), Released under the [MIT](https://github.com/WeebDev/chibisafe/blob/master/LICENSE) License.<br>
Authored and maintained by Pitu.

> [chibisafe.moe](https://chibisafe.moe) · GitHub [@Pitu](https://github.com/Pitu)
