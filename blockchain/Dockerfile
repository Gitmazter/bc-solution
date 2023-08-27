FROM node:18

# Create app directory
WORKDIR /usr/src/kekChain-node

# Install app dependencies
COPY package*.json ./

# Run pre-start scripts
RUN npm install
RUN npx tsc

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "dist/server.js 8080 'http://localhost:8080'" ]