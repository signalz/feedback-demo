<template>
  <div id="app">
    <Header />
    <div class="body">
      <Home />
    </div>
  </div>
</template>

<script>
import Home from "./components/Home.vue";
import Header from './components/Header.vue'

import "ant-design-vue/dist/antd.css"

export default {
  name: 'App',
  components: {
    Header,
    Home,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.body {
  padding-top: 60px;
}
</style>
