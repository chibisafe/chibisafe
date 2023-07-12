### Using Docker

If you want to avoid all the hassle of installing the dependencies, configuring nginx and so on you can try our docker image which makes things a bit simpler.

First make sure you have docker and docker composer installed, so please follow the install instructions for your OS/Distro:
- https://docs.docker.com/engine/install/debian/
- https://docs.docker.com/compose/install/

### Without a reverse proxy
This is the most basic setup, and it works without nginx, caddy or apache2. It exposes the chibisafe port to localhost for you to interact with the service but without being able to run it behind a domain name.

To set up chibisafe using this method, go to the root of the project, copy and rename `docker-compose.example.yml` to `docker-compose.yml` and run `docker-compose up -d`.

Keep in mind that whenever there's a new version of chibisafe and you want to update, you will need to:
```bash
docker pull chibisafe/chibisafe:latest
docker-compose down
docker-compose up -d
```

### Nginx
To use chibisafe with Nginx please refer to the instructions in the [nginx readme](nginx/nginx.md) file.

### Caddy
To use chibisafe with Caddy please refer to the instructions in the [caddy readme](caddy/caddy.md) file.
