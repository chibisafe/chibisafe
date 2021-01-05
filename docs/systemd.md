### Service config for systemd
The file chibisafe-example.service is to be moved to `/etc/systemd/system/chibisafe.service` 

You will need to edit the parameters:
- `User` to be the username/uid of your chibisafe instance
- `WorkingDirectory` to the **FULL** path to your chibisafe, `/home/chibisafe/chibisafe` for example.
- `EnvironmentFile` the same as the above, with the addition of `/.env`, `/home/chibisafe/chibisafe/.env`

```[Unit]
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
WantedBy=multi-user.target```
