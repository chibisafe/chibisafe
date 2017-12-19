FROM node:8-alpine

WORKDIR /app
COPY . /app

RUN apk --update add ffmpeg graphicsmagick
RUN yarn install && yarn global add nodemon

EXPOSE 3000

CMD ["nodemon", "lolisafe.js"]
