FROM node:16.13.1-alpine AS build
WORKDIR /usr/app

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
COPY . ./

RUN npm install
RUN npm run build

FROM node:16.13.1-alpine
WORKDIR /usr/app

COPY package.json ./

COPY --from=build ./usr/app/dist/src/ ./
COPY package* ./
RUN npm install --production

EXPOSE 8080
CMD [ "npm", "start" ]
# FROM node:16.13.1-alpine

# WORKDIR /usr/src/app
# COPY package*.json ./

# RUN npm ci --only=production
# COPY . .

# EXPOSE 8080
# CMD [ "node", "index.js" ]