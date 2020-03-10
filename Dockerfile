FROM node:12.14.1

# Create app directory.
WORKDIR /usr/src/server

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY ./subscriber/authentications.js ./
COPY .babelrc ./

RUN npm install

# Bundle app source
COPY ./subscriber ./

CMD [ "npm", "start" ]