FROM node:21.5.0
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
COPY .env .env
CMD [ "node", "index.js" ]
EXPOSE 8080
