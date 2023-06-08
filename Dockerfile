FROM node:18
USER root

# Update apt
RUN apt -y update

# Install ffmpeg
RUN apt -y install ffmpeg

# Create app directory
WORKDIR /home/node/chibisafe

# Copy app source
COPY backend ./backend
COPY frontend ./frontend

# Install app dependencies
RUN cd backend && npm i
RUN cd frontend && npm i

# Build backend
WORKDIR /home/node/chibisafe/backend

# Generate prisma typings to be able to build
RUN npx prisma generate
RUN npm run build

# Build frontend
WORKDIR /home/node/chibisafe/frontend
RUN npm run build

# Workdir for running
WORKDIR /home/node/chibisafe/backend

CMD ["sh", "-c", "npm run setup && npm run start"];

# HEALTHCHECK --interval=3s --timeout=2s --start-period=15s CMD node ./healthcheck.js
