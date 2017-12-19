FROM node:8

WORKDIR /app
COPY . /app

RUN yarn install && yarn global add nodemon

EXPOSE 3000

CMD ["nodemon", "lolisafe.js"]
