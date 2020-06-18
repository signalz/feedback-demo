<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>

import "ant-design-vue/dist/antd.css"

export default {
  name: 'App',
  components: {
  }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $default-color;
  min-width: $min-width;
}

.body {
  padding-top: 100px;
  padding-left: 20px;
  padding-right: 20px;
}
</style>
