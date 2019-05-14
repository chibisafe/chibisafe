FROM node:11-alpine

LABEL name "lolisafe"
LABEL version "3.0.0"
LABEL maintainer "iCrawl <icrawltogo@gmail.com>"

WORKDIR /usr/src/lolisafe

COPY package.json yarn.lock ./

RUN apk add --no-cache --virtual build-dependencies python make g++ \
&& apk add --no-cache ffmpeg \
&& yarn install \
&& apk del build-dependencies

COPY . .

CMD ["node", "lolisafe.js"]
