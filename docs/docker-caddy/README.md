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
1. Create a base folder, in this case `chibi`. Change to that directory. (`mkdir ~/chibi && cd ~/chibi`)
2. Copy `docker-compose.yml` and `Caddyfile` to `chibi`. Modify `CADDY_DOMAIN` within `docker-compose.yml` to your domain.
3. Clone the repo and switch to the fastify feature. (`git clone https://github.com/chibisafe/chibisafe.git && cd chibisafe && git checkout feature/fastify && cd ..`)
4. Forward ports 80 and 443 to the server if needed.
5. Run `docker compose up -d`

## Basic setup guide (Recommended for beginners)
Docker and Caddy make things super simple, so this should be rather short, except for the fact that I like padding my word count like it's an essay. Let's begin this rather long-winded guide.

1. Install Docker with the Compose plugin if you do not have it. If you are using Ubuntu 18 or later, follow [this guide](https://docs.docker.com/engine/install/ubuntu/). Do note that we are also going to be using the root user, which may not be the most secure implementation, but it is being done for the sake of convenience. For the more advanced users, instructions on how to use Docker rootless can be found [here](https://docs.docker.com/engine/security/rootless/).
2. Create a folder where everything will reside and change into that directory. In this example I'll name it `chibi`. (`mkdir ~/chibi && cd ~/chibi`)
3. Go into the newly created directory and pull the Chibisafe repository (`git clone https://github.com/chibisafe/chibisafe.git`). This will create a new directory named `chibisafe` with most of what we need to get things going. Change into the Chibisafe directory and checkout to the fastify branch, then return to the base directory. (`cd chibisafe && git checkout feature/fastify && cd ..`) NOTE: `feature/fastify` [will be merged into main at some point](https://github.com/chibisafe/chibisafe/pull/378), which means you'll have to checkout back to main (`git checkout main`) to keep up with updates once that's done.
4. Copy the `docker-compose.yml` file from the `chibisafe` directory into the current directory. (`cp chibisafe/docker-compose.yml .`)
It should look like this:
```yml
version: "3.7"
services:
  chibisafe:
    container_name: chibisafe
    build:
     context: ./
     dockerfile: ./Dockerfile
    volumes:
     - ./database:/home/node/chibisafe/database:rw
     - ./uploads:/home/node/chibisafe/uploads:rw
    ports:
     - 24424:8000
    restart: always
```
5. Modify the build context and volumes to reflect the fact that the `docker-compose.yml` will be one level higher. It should look something like this:
```yml
version: "3.7"
services:
     chibisafe:
       container_name: chibisafe
       build:
         context: ./chibisafe
         dockerfile: ./Dockerfile
       volumes:
         - ./chibisafe/database:/home/node/chibisafe/database:rw
         - ./chibisafe/uploads:/home/node/chibisafe/uploads:rw
       ports:
         - 24424:8000
       restart: always
```
6. From here, you can test and make sure chibisafe runs properly before we add Caddy on top. To do that, you can simply run `docker compose up` and let Docker do everything. Once the container is running, you can access the webserver by visiting your IP of choice (`127.0.0.1` or `localhost` if you're doing this on your local machine. If it's on a remote machine, you may or may not have to port forward 24424 for testing.) followed by `:24424` to specify the port. We'll use `localhost:24424` as an example.
7. It should bring up the main webpage, where you can sign in using `admin` as both the username and password to login. Feel free to upload a file for testing purposes.
8. Once you're done, you can simply stop the container and wait for it to exit cleanly with `ctrl + c`. We can the move on to adding Caddy to use a domain with TLS support.
### From this point on, you will need to have a (sub)domain set up and pointed towards your machine to properly use Caddy's TLS functionalities. There are plenty of guides on how to do so online.
9. Create a file named `Caddyfile` (no extensions) and use this as a base:
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
This might look a bit weird for folks unfamiliar with Docker. Docker uses an internal network for each container and allows your applications in the same container to address each other by name. We will also be using environment variables to specify our IP/domain. Read and write buffers are not needed since we're running everything under the same machine.

10. Exit and save the file.
11. Modify `docker-compose.yml` to:
```yml
version: "3.7"

services:
  chibisafe:
    container_name: chibisafe
    build:
      context: ./chibisafe
      dockerfile: ./Dockerfile
    volumes:
      - ./chibisafe/database:/app/database:rw
      - ./chibisafe/uploads:/app/uploads:rw
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
Replace `localhost` with the IP you're using to access the machine, no domains quite yet. Note that we removed the ports from Chibisafe because Caddy will be handling everything as a proxy.

12. Run `docker volume create caddy_data` to create a persistent volume for Caddy to store certs.
13. Run `docker-compose up` and try accessing `localhost:80` rather than `localhost:24424` to make sure Caddy works.
14. Close the container again and prepare a domain pointed to your machine. *Ensure* your ports **80** and **443** are open.
15. Change `CADDY_DOMAIN` to your domain with no ports specified. Caddy by default will use 80 and 443. We can now forward 443 to the Caddy container. Note that in the future, you might need to forward UDP for 443 in order to support HTTP/3, which uses QUIC. This is out of scope for today, so we'll stick with TCP.
```yml
version: "3.7"

services:
  chibisafe:
    container_name: chibisafe
    build:
      context: ./chibisafe
      dockerfile: ./Dockerfile
    volumes:
      - ./chibisafe/database:/app/database:rw
      - ./chibisafe/uploads:/app/uploads:rw
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
16. You can now also modify Caddyfile to properly support HSTS, which adds just a bit more security:
```
{$CADDY_DOMAIN} {
  header {
    # enable HSTS
    Strict-Transport-Security max-age=31536000;

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
17. You can now run `docker compose up`. Give some time for Caddy to obtain a TLS cert, then you should be able to visit `https://my.domain.com`
18. Close the container one last time and run it as a daemon with `docker compose up -d`. This will allow the container to persist even through reboots.
