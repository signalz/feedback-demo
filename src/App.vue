<template>
  <div id="app">
    <SideMenu />
    <router-view/>
  </div>
</template>
<script>

import "ant-design-vue/dist/antd.css"
// import Header from "./components/Header";
import SideMenu from "./components/SideMenu";

export default {
  name: 'App',
  components: {
    // Header,
    SideMenu
  }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // color: #2c3e50;
  color: $default-color;
  min-width: $min-width;
}

.body {
  padding-top: 100px;
  padding-left: 20px;
  padding-right: 20px;
}
</style>
