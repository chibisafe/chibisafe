### Using Docker

If you want to avoid all the hassle of installing the dependencies, configuring nginx and etc you can simply use our docker image which makes things way faster.

First make sure you have docker and docker composer installed, so please follow the install instructions for your OS/Distro:
- https://docs.docker.com/engine/install/debian/
- https://docs.docker.com/compose/install/

After that:
- Copy the config file called `docker-compose.config.example.yml` to `docker-compose.config.yml` with the values you want. Those that are left commented will use the default values.
- Copy either `chibisafe.moe.http.example.conf` or `chibisafe.moe.https.example.conf` to `chibisafe.moe.conf` for either HTTP or HTTPS
- - If using HTTPS make sure to put your certs into the `ssl` folder and name them accordingly:
- - - `chibisafe.moe.crt` for the certificate
- - - `chibisafe.moe.key` for the certificate key

Once you are done run the following commands:

- `cd docker`
- `./chibisafe.sh prod pull`
- `./chibisafe.sh prod build`
- `./chibisafe.sh prod up -d`

Congrats, your chibisafe instance is now running.
