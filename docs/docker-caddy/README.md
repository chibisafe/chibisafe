## Tools
### Docker
[Docker](https://www.docker.com/) is a powerful and handy tool for experts and beginners alike. It allows you to containerize your application and separate it from the rest of your system. Chibisafe is built to have out of the box docker support, allowing you to run a container simply by modifying a couple environment variables. In combination with other tools, such as reverse proxies, you can get Chibisafe running in a secure manner in mere minutes.

### Caddy 2
[Caddy 2](https://caddyserver.com/) is an easy way to get started on building a proper web server with TLS capabilities. Out of the box, it allows you to grab TLS certs via [Lets Encrypt](https://letsencrypt.org/), allowing you to take advantage of encryption to further your security. We will be using a docker container for this so there is no need to install it.

## Prerequisites
OS that supports Docker (This guide is written with Ubuntu 22 being the target OS, but steps should be quite similar for others)

[Docker](https://docs.docker.com/engine/install/) with the Compose plugin

Ensure no other applications are using ports 80, 443, and 24424. 24424 is only temporarily used to test Chibisafe, but 80 and 443 need to be free and forwarded for Caddy to do its thing.
A text editor. Ubuntu 22 comes with `nano`, but I recommend setting up a VS Code work environment to make things easier.

## Quick setup
If you just want the quickest way to get Chibisafe up and running (On Ubuntu 22):
1. Clone the repo and switch to the typescript feature. (`git clone https://github.com/chibisafe/chibisafe.git && cd chibisafe && git checkout feature/typescript`)
2. Copy `docs/docker-caddy/docker-compose.yml` and `docs/docker-caddy/Caddyfile` to `chibisafe`. (`cp docs/docker-caddy/{Caddyfile,docker-compose.yml} .`)
3. Modify `CADDY_DOMAIN` within `docker-compose.yml` to your domain.
4. Run `docker volume create caddy_data` to create a persistent volume for Caddy to store certs.
5. Forward ports 80 and 443 to the server if needed.
6. Run `docker compose up -d`

## Basic setup guide (Recommended for beginners)
Docker and Caddy make things super simple, so this should be rather short, except for the fact that I like padding my word count like it's an essay. Let's begin this rather long-winded guide.

1. Clone the repo and switch to the typescript feature. (`git clone https://github.com/chibisafe/chibisafe.git && cd chibisafe && git checkout feature/typescript`) NOTE: `feature/typescript` [will be merged into main at some point](https://github.com/chibisafe/chibisafe/pull/378), which means you'll have to checkout back to main (`git checkout main`) to keep up with updates once that's done.
2. From here, you can test and make sure chibisafe runs properly before we add Caddy on top. To do that, you can simply run `docker compose up` and let Docker do everything. Once the container is running, you can access the webserver by visiting your IP of choice (`127.0.0.1` or `localhost` if you're doing this on your local machine. If it's on a remote machine, you may or may not have to port forward 24424 for testing.) followed by `:24424` to specify the port. We'll use `localhost:24424` as an example.
3. It should bring up the main webpage, where you can sign in using `admin` as both the username and password to login. Feel free to upload a file for testing purposes.
4. Once you're done, you can simply stop the container and wait for it to exit cleanly with `ctrl + c`. We can the move on to adding Caddy to use a domain with TLS support.
### From this point on, you will need to have a (sub)domain set up and pointed towards your machine to properly use Caddy's TLS functionalities. There are plenty of guides on how to do so online.
5. Create a file named `Caddyfile` (no extensions) and use this as a base:
```
{$CADDY_DOMAIN} {
  reverse_proxy chibisafe:8000 {
    transport http {
      read_buffer 0
      write_buffer 0
    }
  }
}
```
Docker uses an internal network for each container and allows your applications in the same container to address each other by name, which is why we use `chibisafe` as our host for reverse proxying. We will also be using the environment variable `CADDY_COMAIN` to specify our IP/domain. Read and write buffers are not needed since we're running everything under the same machine, which is why they are set to 0.

6. Exit and save the file.
7. Modify `docker-compose.yml` to:
```yml
version: "3.7"

services:
  chibisafe:
    container_name: chibisafe
    build:
      context: ./
      dockerfile: ./Dockerfile
    volumes:
      - ./database:/app/database:rw
      - ./uploads:/app/uploads:rw
    environment:
      - NODE_ENV=production
    restart: always
  caddy:
    image: caddy-2.7
    container_name: caddy
    restart: always
    ports:
      - "80:80"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    environment:
      -	CADDY_DOMAIN=localhost:80
    depends_on:
      - chibisafe

volumes:
  caddy_data:
    external: true
  caddy_config:
```
Replace `localhost` with the IP you're using to access the machine, no domains quite yet. Note that we removed the ports from Chibisafe because Caddy will be handling everything as a proxy. We are also specifying `:80` to prevent Caddy from attempting to grab a TLS cert.

8. Run `docker volume create caddy_data` to create a persistent volume for Caddy to store certs.
9. Run `docker-compose up` and try accessing `localhost:80` rather than `localhost:24424` to make sure Caddy works.
10. Close the container again and prepare a domain pointed to your machine. *Ensure* your ports **80** and **443** are open and forwarded if needed.
11. Change `CADDY_DOMAIN` to your domain with no ports specified. Caddy by default will use 80 and 443. We can now forward 443 to the Caddy container. Note that in the future, you might need to forward UDP for 443 (`443:443/udp`) in order to support HTTP/3, which Caddy lets you do from version 2.6 or later. This is out of scope for today, so we'll stick with TCP.
```yml
version: "3.7"

services:
  chibisafe:
    container_name: chibisafe
    build:
      context: ./
      dockerfile: ./Dockerfile
    volumes:
      - ./database:/app/database:rw
      - ./uploads:/app/uploads:rw
    environment:
      - NODE_ENV=production
    restart: always
  caddy:
    image: caddy-2.7
    container_name: caddy
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    environment:
      -	CADDY_DOMAIN=my.domain.com
    depends_on:
      - chibisafe

volumes:
  caddy_data:
    external: true
  caddy_config:
```
12. (OPTIONAL) You can also modify Caddyfile to properly support HSTS, which adds just a bit more security. This is a completely optional step, and should only be used for a more permanent deployment:
```
{$CADDY_DOMAIN} {
  header {
    # enable HSTS
    Strict-Transport-Security max-age=86400;

    # keep referrer data off of HTTP connections
    Referrer-Policy no-referrer-when-downgrade
  }

  reverse_proxy chibisafe:8000 {
    transport http {
      read_buffer 0
      write_buffer 0
    }
  }
}
```

13. You can now run `docker compose up`.
14. Give some time for Caddy to obtain a TLS cert, then you should be able to visit `https://my.domain.com`
15. Close the container one last time and run it as a daemon with `docker compose up -d`. This will allow the container to persist even through reboots. If you ever want to restart the container, you can use `docker compose restart` within the `chibisafe` directory. 
