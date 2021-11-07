FROM node:lts-alpine as builder

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY package.json package-lock.json ./
RUN NODE_ENV=production npm ci

COPY . .
RUN npm run ci

CMD ["npm", "start", "--port=$ADDR --mongo=$MONGO --dbinit=$DBINIT --db=$DB"]