FROM node:9

LABEL name "lolisafe"
LABEL version "3.0.0"
LABEL maintainer "iCrawl <icrawltogo@gmail.com>"

WORKDIR /usr/src/lolisafe

COPY package.json yarn.lock ./

RUN sh -c 'echo "deb http://www.deb-multimedia.org jessie main" >> /etc/apt/sources.list' \
&& apt-key adv --keyserver keyring.debian.org --recv-keys 5C808C2B65558117 \
&& apt-get update \
&& apt-get install -y ffmpeg graphicsmagick \
&& yarn install

COPY . .

CMD ["node", "lolisafe.js"]
