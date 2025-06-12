FROM node:24-alpine

WORKDIR /APP

COPY package*.json .

RUN npm install --omit=dev

COPY . ./APP

RUN node index.js

CMD ["node", "index.js"]