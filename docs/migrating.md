### Migrate from v3 to v4
This version introduces a few breaking changes and updating requires some manual work.
For starters we recommend cloning the new version somewhere else instead of `git pull` on your v3 version.

- After cloning move your `uploads` folder from the v3 folder to the new v4 folder.
- Then copy your `database/db` file from your v3 folder to the root of your v4 folder.
- Make sure to install the dependencies by running `npm i`
- You then need to run `npm run setup` from the v4 folder and finish the setup process.
- Once that's done you need to manually run `node src/api/scripts/databaseMigration.js` from the root folder of v4.
- This will migrate the v3 database to v4 and regenerate every single thumbnail in webp to save bandwidth.
- After the migration finishes, the last step is to update your nginx config with the [newly provided script](./nginx.md).
- Restart nginx with `sudo nginx -s reload`.
- And lastly start your chibisafe instance with `pm2 start pm2.json`.

### Breaking changes
- If you are using the chibisafe extension from one of the stores, the new version has been submitted already. You can also load the unpacked extension by cloning [this repo](https://github.com/WeebDev/chibisafe-extension).
- The chibisafe browser extension needs your new token. Instead of pasting your jwt token into it like before, you need to log in to chibisafe, go to your user settings and generate an `API KEY`, which you will use to access the service from 3rd party apps like the browser extension, ShareX, etc.
- To upload a file to an album directly users used to use the endpoint `/api/upload/${albumId}`. This is no longer the case. To upload directly to an album now it's necessary to pass a header called `albumid` with an integer as the value of the album to which you want to upload the file to.
