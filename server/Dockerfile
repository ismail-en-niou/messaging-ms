FROM node:20-alpine3.20

WORKDIR /APP

COPY package*.json /APP/


RUN npm install

COPY . /APP/

CMD [ "node", "index.js" ]