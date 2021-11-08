FROM node:lts-alpine as builder

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run ci && \
    tar -c ../build . 

FROM node:lts-alpine

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY --from=builder /home/node/build /home/node/build

EXPOSE 80

CMD ["sh", "-c", "tar -xzf ../build && npm start"]