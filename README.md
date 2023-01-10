### Under heavy development, not ready for production

Regardless of how you want to use chibisafe every way uses the `.env` file to populate some settings during build time. So the first thing you need to do is:
- Copy `.env.sample` and rename it to `.env`. Replace values as you see fit.

Now you can choose how to run the service from the 3 options below.

If you want to run this branch without docker:
- cd into `backend` and then `npm setup` and then `npm run dev:reload`.
- in another terminal, cd into `frontend` and then `npm i` then `npm run dev`

Alternatively if you use vscode, you can go to the `Run and debug` menu and hit Play, it should start all the processes automatically and open a browser for you to test the service.

If you want to run it via docker then it's as simple as `docker-compose up`.
