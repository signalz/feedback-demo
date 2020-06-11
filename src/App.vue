<template>
  <div id="app">
    <Header />
    <router-view/>
  </div>
</template>
<script>

import "ant-design-vue/dist/antd.css"
import Header from "./components/Header";

export default {
  name: 'App',
  components: {
    Header
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.body {
  padding-top: 100px;
  padding-left: 20px;
  padding-right: 20px;
}
</style>
