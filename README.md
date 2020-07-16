# feedback-demo

## Project setup

```javascript
yarn install
```

### Compiles and hot-reloads for development

```javascript
yarn serve
```

### Compiles and minifies for production

```javascript
yarn build
```

### Lints and fixes files

```javascript
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Prod deployment

- require node 14 and npm 6
- npm i -g yarn
- npm i -g live-server
- yarn install
- Change END_POINT in config.js
- yarn build
- cd ./dist
- live-server --port=3080 --entry-file=./index.html
