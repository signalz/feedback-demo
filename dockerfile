FROM node:latest

WORKDIR /usr/src/app

COPY . ./

RUN yarn global add @vue/cli
RUN yarn global add live-server
RUN yarn install
RUN yarn build
RUN cd ./dist

EXPOSE 8080
CMD ["live-server", "--port=8080" "--entry-file=./index.html"]
