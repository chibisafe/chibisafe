FROM node:8

WORKDIR /app
COPY . /app

RUN sh -c 'echo "deb http://www.deb-multimedia.org jessie main" >> /etc/apt/sources.list' && \
  apt-get update && apt-get install -y --force-yes deb-multimedia-keyring ffmpeg graphicsmagick
RUN yarn install

EXPOSE 3000

CMD ["node", "lolisafe.js"]
