### Under heavy development, not ready for production

If you want to run this branch without docker:
- Copy `.env.sample` and rename it to `.env`. Replace values as you see fit.
- cd into `backend` and then `npm i`, `npm run migrate` and `npm run dev:reload`.
- in another terminal, cd into `frontend` and then `npm i` then `npm run dev`

Alternatively if you use vscode, you can go to the `Run and debug` menu and hit Play, it should start all the processes automatically and open a browser for you to test the service.

If you want to run it via docker then it's as simple as `docker-compose up`.
