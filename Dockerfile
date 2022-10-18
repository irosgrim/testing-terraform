FROM node:16.13.1-slim AS build
WORKDIR /usr/app

COPY . ./

RUN npm install
RUN npm run build

FROM node:16.13.1-slim
WORKDIR /usr/app

COPY package.json ./

COPY --from=build ./usr/app/dist/src/ ./

COPY package* ./
RUN npm install --production

EXPOSE 8080
CMD [ "npm", "start" ]