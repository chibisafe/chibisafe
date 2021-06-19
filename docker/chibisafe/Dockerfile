FROM jrottenberg/ffmpeg:4.3-alpine312 as ffmpeg

FROM node:14-alpine

WORKDIR /usr/chibisafe
COPY package.json package-lock.json ./

RUN apk add --update \
&& apk add --no-cache ca-certificates libwebp libwebp-tools expat \
&& apk add --no-cache vidstab-dev --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community \
&& apk add --no-cache --virtual .build-deps git curl build-base python3 g++ make \
&& npm ci \
&& apk del .build-deps

COPY --from=ffmpeg /usr/local /usr/local

COPY . .
RUN mkdir uploads && mkdir database

CMD ["sh", "-c", "npm run migrate && npm run seed && npm start"]
