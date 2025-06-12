FROM node:20-alpine3.20

WORKDIR /APP

COPY package*.json ./APP/

RUN npm install

COPY . /APP/

RUN npm run build

CMD [ "npm", "run", "dev" ]