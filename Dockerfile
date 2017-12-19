FROM node:8

WORKDIR /app
COPY . /app

RUN yarn install && yarn global add pm2

EXPOSE 3000

CMD ["pm2", "start", "lolisafe.js"]
