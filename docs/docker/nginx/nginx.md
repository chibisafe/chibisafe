### Nginx

To use chibisafe with Docker and a domain name of your choosing, you will need to make a few adjustements.

1. Copy and rename either `chibisafe.moe.http.example.conf` or `chibisafe.moe.https.example.conf` depending if you want HTTPS support or not and name it `chibisafe.moe.conf`. Make sure it's in the same folder that you copied it from.
2. Edit the copied `chibisafe.moe.conf` and replace the `servername` directive with the domain you plan on using.
3. If you plan on using HTTPS, make sure to place both `.crt` and `.key` certificates in the `ssl` folder.
4. Run `docker-compose up -d` from within the nginx folder and you should be ready to go.
