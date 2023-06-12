FROM node:18
USER root

# Update apt
RUN apt -y update

# Install ffmpeg
RUN apt -y install ffmpeg

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

# Install app dependencies
RUN yarn install
RUN yarn prisma:generate
RUN yarn build

# Workdir for running
WORKDIR /home/node/chibisafe/packages/backend

CMD ["sh", "-c", "yarn setup && yarn start"];
