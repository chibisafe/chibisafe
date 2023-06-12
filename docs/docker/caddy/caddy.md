## Tools
### Docker
[Docker](https://www.docker.com/) is a powerful and handy tool for experts and beginners alike. It allows you to containerize your application and separate it from the rest of your system. Chibisafe is built to have out of the box docker support, allowing you to run a container simply by modifying a couple environment variables. In combination with other tools, such as reverse proxies, you can get Chibisafe running in a secure manner in mere minutes.

### Caddy 2
[Caddy 2](https://caddyserver.com/) is an easy way to get started on building a proper web server with TLS capabilities. Out of the box, it allows you to grab TLS certs via [Lets Encrypt](https://letsencrypt.org/), allowing you to take advantage of encryption to further improve your security. We will be using a docker container for this so there is no need to install it.

## Prerequisites
OS that supports Docker (This guide is written with Ubuntu 22 being the target OS, but steps should be quite similar for others)

[Docker](https://docs.docker.com/engine/install/) with the Compose plugin

Ensure no other applications are using ports 80, 443, and 24424. 24424 is only temporarily used to test Chibisafe, but 80 and 443 need to be free and forwarded for Caddy to do its thing.
A text editor. Ubuntu 22 comes with `nano`, but I recommend setting up a VS Code work environment to make things easier.

## Quick setup
If you just want the quickest way to get Chibisafe up and running (On Ubuntu 22):
1. Clone the repo (`git clone https://github.com/chibisafe/chibisafe.git && cd chibisafe`)
2. Copy `docs/docker/caddy/docker-compose.yml` and `docs/docker/caddy/Caddyfile` to `chibisafe`. (`cp docs/docker/caddy/{Caddyfile,docker-compose.yml} .`)
3. Modify `CADDY_DOMAIN` within `docker-compose.yml` to your domain.
4. Run `docker volume create caddy_data` to create a persistent volume for Caddy to store certs.
5. Forward ports 80 and 443 to the server if needed.
6. Run `docker compose up -d`

## Updating
Updating is very simple, but can lead to confusion if you haven't used git before.
1. Stash your changes with `git stash`
2. Pull new updates with `git pull`
3. Re-apply your changes with `git apply`. Note that depending on what has changed with the newer versions, you may have to resolve conflicts. VS Code makes it easier to visualize the changes and apply whichever works for you.
4. Rebuild the chibisafe image with `docker compose build chibisafe`
5. Recreate the container with the new chibisafe image with `docker compose down && docker compose up -d`
