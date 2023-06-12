### Nginx

To use chibisafe with Docker and a domain name of your choosing, you will need to make a few adjustements.

1. Copy `docker-compose.yml` and paste it on the project's root.
2. Copy and rename `chibisafe.moe.example.conf` to `chibisafe.moe.conf` in the same directory.
3. Edit the copied `chibisafe.moe.conf` and replace the `servername` directive with the domain you plan on using.
4. If you plan on using HTTPS, make sure to place both `.crt` and `.key` certificates in the `ssl` folder.
5. Run `docker-compose up -d` from within the nginx folder and you should be ready to go.

> Note: If you want to use certbot/letsencrypt instead of manually placing the certificates, we would appreciate if you could edit these instructions and let us know the proper way to do it!
