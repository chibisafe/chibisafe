FROM node:18-alpine
USER root

# Update apk
RUN apk update

# Install ffmpeg
RUN apk add --no-cache ffmpeg

# Create app directory
WORKDIR /home/node/chibisafe

# Copy app source
COPY packages ./packages
COPY .yarn .yarn
COPY .yarnrc.yml .yarnrc.yml
COPY package.json package.json
COPY yarn.lock yarn.lock
COPY tsconfig.json tsconfig.json
COPY turbo.json turbo.json

# Install and prepare the app
RUN yarn install
RUN yarn migrate
RUN yarn build

CMD ["sh", "-c", "yarn migrate && yarn start"];
