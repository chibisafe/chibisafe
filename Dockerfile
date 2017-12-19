FROM node:8-alpine

WORKDIR /app
COPY . /app

RUN apk --update add ffmpeg graphicsmagick
RUN yarn install

EXPOSE 3000

CMD ["node", "lolisafe.js"]
