FROM node:20.4.0

WORKDIR /usr/src/app

COPY ./package.json .

RUN npm install

COPY . .
CMD npm run develop