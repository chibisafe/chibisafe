FROM node:18
USER root

# Create app directory
WORKDIR /usr/src/chibisafe

# Install app dependencies
COPY backend/package.json ./backend/
COPY backend/package-lock.json ./backend/
RUN cd backend && npm i

COPY frontend/package.json ./frontend/
COPY frontend/package-lock.json ./frontend/
RUN cd frontend && npm i

# Bundle app source
COPY . .

RUN cd backend && npm run build
RUN cd frontend && npm run build

CMD ["sh", "-c", "cd backend && npm run setup && npm run start"];

# HEALTHCHECK --interval=3s --timeout=2s --start-period=15s CMD node ./healthcheck.js
