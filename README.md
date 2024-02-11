# Harmonyspring

This project is a fork of the original [chibisafe](https://github.com/chibisafe/chibisafe) project, which is suitable for deployment
**This project is currently incomplete and not suitable for any deployment.**

- Fully written in TypeScript
- Better and faster file upload and file chunking logic
- Log everything to view with a custom log viewer
- Rewrite the old NuxtJS and Bulma frontend to Vite with Vue 3 and TailwindCSS
- Docker support out of the box
  - Try running `docker-compose up` from the root to have the project up and running in a flash
- Instead of `express` we're now using Fastify which is faster
- Switched from `knex` to [Prisma](https://www.prisma.io/)
- The routes have been reworked and the controllers are completely gone
  - This gives us more freedom to write routes
  - Routes accept an array of middlewares
  - Created a middleware system which is super easy to extend

Routes are TypeScript files located in `src/routes` and they need to export 2 things to be treated as such:

```ts
export const options = {
	url: '/admin/user/:uuid',
	method: 'get',
	middlewares: ['auth', 'admin']
};

export const run = async (req: Request, res: Response) => {
```

`options.url` and `options.method` are required while `middlewares` is an option array of middlewares to execute before the router executes the exported `run()` method. 

You can refer to [this commited file](https://github.com/WeebDev/chibisafe/blob/0661fb8bee67b253e5c6bcd4afa37f5da0996636/src/api/routes/GetVersion.ts) for an example


- Every incoming request will be logged to console while running the service in development mode
  - For production every log message will be saved to a daily rotating log found in the `/logs` folder
- Added an [Insomnia](https://insomnia.rest/) data export file to test routes (needs updating)
- Reworked the folder structure to better accommodate a monorepo.
- Switched from `npm` to `yarn` for monorepo capabilities
- We use [Turbo](https://github.com/vercel/turbo) no for building the project from the root folder
- Instead of having both a backend and frontend process, the frontend is now served as a static site from the backend
- Changed from dropzone to our new [Chibisafe Uploader](https://github.com/chibisafe/uploader) for more control
- Added the possibility to invite users to a closed instance via an invite link
- When opening a file preview, there are now Copy, Open and Delete buttons as the main actions
- Files can now be added and removed from albums from the file preview modal
- Videos and Audio can now be previewed in the file preview modal
- `npm run studio` will now open Prisma Studio in the browser to let you edit the database in real time
- [Development only] you can launch the entire chibisafe stack from Visual Studio Code actions now
- Prevent running chibisafe if core environment variables are missing, node version is not recent, or ffmpeg is not present in the system
- Albums now support being marked as NSFW to prevent loading the content before consent
- Changed how the meta tags system works. Before the user would need to supply a big `.env` file with all the information needed to be able to build both frontend and backend, now these values will be set by default enabling the user to change them through the settings panel on the chibisafe website. The only environment variable supported now is `PORT` to change it from the default which is `8000`, but it's not needed to build the service.
- Added a breadcrumbs component to make it easier to navigate back and forth on the dashboard
- Now you can delete files as an admin, which wasn't possible before
- The backend now injects the meta tags into the `index.html` page upon starting, in the future when the user changes those values from the settings panel the file should be reloaded to reflect the new changes without restarting the service.
- Added Masonry and List view of files, saving the preference locally
- Added better pagination with "Go to page" support thanks to @pilar6195 
- Added CTRL/CMD+V pasting of files on the homepage to upload directly from the clipboard
- Added handy debug feature to the frontend to nicely print things to browser console
</details>

---

### Features
- [Beautiful docs](https://chibisafe.moe/docs)
- [S3 Storage Support](https://github.com/chibisafe/chibisafe/blob/master/docs/s3.md)
- Chunked uploads
- Share direct links to uploaded files
- Albums/Folders with direct links to share
- File management
- File tagging
- User management
- User quotas
- Update checker
- Public or Private mode (with invite support)
- ShareX support out-of-the-box to upload screenshots/screenrecordings from your desktop
- Browser extension to upload content from websites easily
- Easily extensible
- Open source
- No tracking (except for IP logging of requests)
- No ads

## Installing and running chibisafe
Whichever method you choose to install chibisafe keep in mind that the installation process creates an account named `admin` with the same password. Once you log in the first time make sure to change it!

## Docker
To deploy chibisafe with docker you have a few options.
If you want the latest features you can clone the repository and then run `docker-compose up`.

If you want to use the latest stable image published by us you can make a `docker-compose.yml` file with the following contents and then run `docker-compose up`:
```yml
version: "3.7"

services:
  chibisafe:
    image: chibisafe/chibisafe:latest
    container_name: chibisafe
    volumes:
      - ./database:/home/node/chibisafe/database:rw
      - ./uploads:/home/node/chibisafe/uploads:rw
      - ./logs:/home/node/chibisafe/logs:rw
    ports:
      - 24424:8000
    restart: always

```
Or if you prefer to use docker directly, you could do something like this replacing the path values (if necessary) with your own:
```bash
docker run -d \
  --name=chibisafe \
  -v ./database:/home/node/chibisafe/database:rw \
  -v ./uploads:/home/node/chibisafe/uploads:rw \
  -v ./logs:/home/node/chibisafe/logs:rw \
  -p 24424:8000 \
  --restart unless-stopped \
  chibisafe/chibisafe:latest
```

Now chibisafe will be available in port 24424.

For more in-depth configurations [Please refer to the docs here](docs/docker/docker.md)

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
7. If you want to run chibisafe behind your own domain, we have some [docker guides](docs/docker/docker.md) on how to do this.

## Migration

<details>
  <summary>Migrating from v3.x (lolisafe) to v4.x (chibisafe)</summary>

If you are upgrading from `v3.x` to `v4.0.0` (lolisafe to chibisafe) and you want to keep your files and relations please read the [migration guide](docs/migrating-v3-to-v4.md). Keep in mind the migration is a best-effort script and it's recommended to start from scratch. That being said the migration does work but it's up to you to make a backup beforehand in case something goes wrong.

`v4.0.1` changed the hashing algorithm for a better, faster one. So if you are currently running v4.0.0 and decide to update to v4.0.1+ it's in your best interest to rehash all the files your instance is serving. To do this go to the chibisafe root folder and run `node src/api/utils/rehashDatabase.js`. Depending on how many files you have it can take a few minutes or hours, there's a progress bar that will give you an idea.
</details>

<details>
	<summary>Migrating from v4.x to v5</summary>

If you're upgrading from `v4.x` to `v5` you can run `yarn install && yarn migrate-v4-to-v5` to start the migration process. Depending how many files you have in your old instance it can take up to 30 minutes so be patient. It'll ask you for the absolute path to your v4 sqlite database and then it'll proceed to migrate your data. Once the process is done there is one more thing to do, which is to move the old `./uploads` folder from chibisafe v4 to the root of your v5 folder.

> Note: if your uploads folder is in another location like a different/network drive and you are using symlinks, make sure to update the symlink to point it to the uploads folder in root of the new chibisafe
</details>
