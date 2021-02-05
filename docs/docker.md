### Using Docker

If you want to avoid all the hassle of installing the dependencies, configuring nginx and etc you can simply use our docker image which makes things way faster.
First make sure you have docker and docker composer installed, on Linux this would be `sudo apt install docker-ce`.
After that edit the config file called `docker-compose.config.example.yml` with the values you want. Those that are left commented will use the default values.
Once you are done editing that file remove the `example` from the name so it ends up being `docker-compose.config.yml` and run the following commands:

- `cd docker`
- `./chibisafe prod pull`
- `./chibisafe prod build`
- `./chibisafe prod up -d`

Congrats, your chibisafe instance is now running.
