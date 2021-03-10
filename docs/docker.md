### Using Docker

If you want to avoid all the hassle of installing the dependencies, configuring nginx and etc you can simply use our docker image which makes things way faster.

First make sure you have docker and docker composer installed, so please follow the install instructions for your OS/Distro:
- https://docs.docker.com/engine/install/debian/
- https://docs.docker.com/compose/install/

After that:
- Copy the config file called `docker-compose.config.example.yml` to `docker-compose.config.yml` with the values you want. Those that are left commented will use the default values.
- Copy either `toshokan.moe.http.example.conf` or `toshokan.moe.https.example.conf` to `toshokan.moe.conf` for either HTTP or HTTPS
- - If using HTTPS make sure to put your certs into the `ssl` folder and name them accordingly:
- - - `toshokan.moe.crt` for the certificate
- - - `toshokan.moe.key` for the certificate key

Once you are done run the following commands:

- `cd docker`
- `./toshokan prod pull`
- `./toshokan prod build`
- `./toshokan prod up -d`

Congrats, your toshokan instance is now running.
