FROM node:latest

WORKDIR /usr/src/app

COPY . ./

RUN yarn global add @vue/cli
RUN yarn global add http-server
RUN yarn install
RUN yarn build

EXPOSE 8080
CMD ["http-server", "./dist"]
