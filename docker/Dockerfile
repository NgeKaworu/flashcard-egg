FROM node:lts-alpine as builder

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run ci

CMD ["sh", "-c", "npm start"]