<p align="center">
  <img width="234" height="376" src="https://lolisafe.moe/xjoghu.png">
</p>

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/kanadeko/Kuro/master/LICENSE)
[![Chat / Support](https://img.shields.io/badge/Chat%20%2F%20Support-discord-7289DA.svg?style=flat-square)](https://discord.gg/5g6vgwn)
[![Support me](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Dpitu%26type%3Dpledges&style=flat-square)](https://www.patreon.com/pitu)
[![Support me](https://img.shields.io/badge/Support-Buy%20me%20a%20coffee-yellow.svg?style=flat-square)](https://www.buymeacoffee.com/kana)

## What is Chibisafe?
Chibisafe is a file uploader service written in node that aims to to be easy to use and easy to set up. It's easy to use, easy to deploy, free and open source. It accepts files, photos, documents, anything you imagine and gives you back a shareable link for you to send to others.

It supports both public and private mode. Public mode let's anyone sign up and start uploading files to the service, whereas private mode only users with an invite link can do so. During upload, if the file is big it's automatically split into chunks to minimize the chance of network failures enabling you to retry each chunk up to 5 times. Users can also create an API key to use with 3rd party applications to interact directly with their account.

The service also comes with a control panel where you can edit almost every configuration of the instance directly from the UI without having to touch environment or configuration files manually. Control the name, the ratelimit, max file size, accepted extensions, meta descriptions, etc directly from an intuitive panel.


### Features
- Chunked uploads
- Share direct links to uploaded files
- Albums/Folders with direct links to share
- File management
- File tagging
- User management
- Public or Private mode (with invite support)
- ShareX support out-of-the-box to upload screenshots/screenrecordings from your desktop
- Browser extension to upload content from websites easily
- Easily extensible
- Open source
- No tracking (except for IP logging of requests)
- No ads

## Installing and running chibisafe

## Docker
To deploy chibisafe with docker clone the repository and then run `docker-compose up`. Now chibisafe will be available in port 24424.
For more in-depth configurations [Please refer to the docs here](docs/docker.md)

## Manually

### Pre-requisites
This small guide assumes a lot of things including but not limited to you knowing your way around linux.

- `node` version 18 (we recommend using [volta.sh](https://volta.sh/))
- `ffmpeg` package installed
- `nginx` installed and running (if you want to run chibisafe behind a domain)

> Note: while Chibisafe works on Windows out-of-the-box by accesing the IP directly, we don't cover how to set up nginx/caddy/apache2 reverse proxy to have a domain name.

### Installing
1. Clone the repository and `cd` into it
2. Run `yarn install`
3. Run `yarn migrate`
4. Run `yarn build`
5. Run `yarn start`
6. Chibisafe should now be running at http://localhost:8000
7. If you want to run chibisafe behind your own domain, we have a simple [nginx](docs/nginx.md) guide on how to do this.

<details>
  <summary>Migrating from v3.x (lolisafe) to v4.x (chibisafe)</summary>

If you are upgrading from `v3.x` to `v4.0.0` (lolisafe to chibisafe) and you want to keep your files and relations please read the [migration guide](docs/migrating.md). Keep in mind the migration is a best-effort script and it's recommended to start from scratch. That being said the migration does work but it's up to you to make a backup beforehand in case something goes wrong.

`v4.0.1` changed the hashing algorithm for a better, faster one. So if you are currently running v4.0.0 and decide to update to v4.0.1+ it's in your best interest to rehash all the files your instance is serving. To do this go to the chibisafe root folder and run `node src/api/utils/rehashDatabase.js`. Depending on how many files you have it can take a few minutes or hours, there's a progress bar that will give you an idea.
</details>

<details>
	<summary>Migrating from v4.x to v5</summary>
	At the moment there is no migration script, so users that want to use v5 need to start with a clean slate.
</details>

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
