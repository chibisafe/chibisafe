### Service config for systemd
If you want to keep Chibisafe running by using systemd you can copy the example code shown below and create the file `/etc/systemd/system/chibisafe.service` with it.

You will need to edit the parameters:
- `User` to be the username/uid of your chibisafe instance
- `WorkingDirectory` to the **FULL** path to your chibisafe, `/home/chibisafe/chibisafe` for example.
- `EnvironmentFile` the same as the above, with the addition of `/.env`, `/home/chibisafe/chibisafe/.env`

### If you are using n/nvm you will also need to update the path to npm in `ExecStart`
- For n this will likely be `/home/username/n/bin/npm`
- You can also find this by running `whereis npm` in your terminal and copy the path from the output.

Example below.

```
[Unit]
Description=chibisafe, easy to use file uploader
After=network.target

[Service]
Type=simple
User=chibisafe
WorkingDirectory=/home/chibisafe/chibisafe
EnvironmentFile=/home/chibisafe/chibisafe/.env
ExecStart=/usr/bin/npm run start
Restart=always

[Install]
WantedBy=multi-user.target
```
