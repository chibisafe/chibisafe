<p align="center">
  <img width="234" height="376" src="https://lolisafe.moe/xjoghu.png">
</p>

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/chibisafe/chibisafe/master/LICENSE)
[![Chat / Support](https://img.shields.io/badge/Chat%20%2F%20Support-discord-7289DA.svg?style=flat-square)](https://discord.gg/5g6vgwn)
[![Support me](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Dpitu%26type%3Dpledges&style=flat-square)](https://www.patreon.com/pitu)
[![Support me](https://img.shields.io/badge/Support-Buy%20me%20a%20coffee-yellow.svg?style=flat-square)](https://www.buymeacoffee.com/kana)

## What is Chibisafe?
Chibisafe is a file uploader service written in typescript that just works. It's easy to use, easy to deploy, free and open source. It accepts files, photos, documents, anything you imagine and gives you back a shareable link for you to send to others.

You can run it in public mode, user accounts mode or invite-only mode. Big files are automatically chunked to minimize network failure and users can create an API key to use the service programatically and hook it to other things.

The service also comes with a dashboard where you can edit almost every configuration of the instance directly from the UI without having to touch environment or configuration files manually. Control the name, the rate limit, max file size, accepted extensions, meta descriptions, etc directly from our intuitive panel.

_If you fork/deploy your own instance it would mean a lot if you were to keep either the GitHub logo to our repo or a link to it 💖_

---
<p align="center">
	<img src="https://repobeats.axiom.co/api/embed/ef349e2a33281ebd0e289a666892597deb08ee1a.svg">
</p>

### Features of v6 aka Holo
- 📄 [Beautiful docs](https://chibisafe.app/docs)
- 🗄️ [S3 Storage Support](https://github.com/chibisafe/chibisafe/blob/master/docs/s3.md)
- 📷 Beautiful masonry to browse media files
- ✨ Chunked uploads for big files
- 🔗 Share direct links to uploaded files
- 📂 Albums/Folders with direct links to share
- 📝 Snippets/Gists creation with direct links to share
- 🗃️ File management and file tagging
- 🙋 User management and quotas
- 🔗 Built-in URL shortener
- ✉️ Public or Private mode (with invite support)
- ⬆️ ShareX support out-of-the-box to upload screenshots/screenrecordings from your desktop
- 📱 iOS shortcut to upload files through the share menu
- 🌐 Browser extension to upload content from websites easily
- 🧩 Easily extensible
- 📖 Open source
- 🚫 No ads and no tracking (except for IP logging of requests)


## Installing and running chibisafe
Whichever method you choose to install chibisafe keep in mind that the installation process creates an account named `admin` with the same password. Once you log in the first time make sure to change it! Also we ***highly*** recommend using docker for chibisafe.

- [Running chibisafe with Docker](https://chibisafe.app/guides/running-with-docker) | [Alternate link](https://github.com/chibisafe/chibisafe/blob/master/packages/next/src/content/guides/running-with-docker.mdx)
- [Running chibisafe manually](https://chibisafe.app/guides/running-manually) | [Alternate link](https://github.com/chibisafe/chibisafe/blob/master/packages/next/src/content/guides/running-manually.mdx)
- [Using network storage with chibisafe](https://chibisafe.app/guides/using-network-storage) | [Alternate link](https://github.com/chibisafe/chibisafe/blob/master/packages/next/src/content/guides/using-network-storage.mdx)

For more guides and how to set up different aspects of the service [please refer to the guides](https://chibisafe.app/guides)

## Migrate from older versions

### v5 to v6

If you come from v5 you might be used to chibisafe exposing 1 single port for you to reverse proxy into nginx/caddy/apache. Starting from v6 this is also the case (although port is now 24424) as long as you run the configuration we provide with docker. Other than configuring your reverse proxy accordingly, all you need to do to migrate is to copy both the `uploads/` and `database/` folders into your new instance folder. Once chibisafe starts it will apply the necessary migrations automatically.
</details>

> [!CAUTION]
> Migrating from an older version than v5 to v6 is not possible, so we recommend setting up a new instance instead.

### Screenshots
<p align="center">
	
![msedge_AjPLFovUHQ](https://github.com/chibisafe/chibisafe/assets/7425261/84a8f980-ae11-4f7d-b26c-e8b4e8d8d9f8)
![msedge_UH0h77QQoc](https://github.com/chibisafe/chibisafe/assets/7425261/199c9f1a-d1ab-4bcf-9842-40bcc12a4a19)
![msedge_BlsPiNf53x](https://github.com/chibisafe/chibisafe/assets/7425261/5076aa11-268a-4a64-ba6a-b6af721aaead)
![msedge_iIXnaUohh6](https://github.com/chibisafe/chibisafe/assets/7425261/09f38a44-f615-4698-9006-2e41759c411d)

</p>

## Author

**Chibisafe** © [Pitu](https://github.com/Pitu), Released under the [MIT](https://github.com/WeebDev/chibisafe/blob/master/LICENSE) License.<br>
Authored and maintained by Pitu.

<a href="https://github.com/chibisafe/chibisafe/graphs/contributors">
	<img src="https://contrib.rocks/image?repo=chibisafe/chibisafe" />
</a>
