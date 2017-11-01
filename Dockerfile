FROM node:8

# Create the app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install the app dependencies
COPY package.json /usr/src/app/
RUN npm install --production

# Bundle app source
COPY . /usr/src/app

# Expose the app port
EXPOSE 9999

# Run the server
CMD ["node", "./lolisafe.js"]
