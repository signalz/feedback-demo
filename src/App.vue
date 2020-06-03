<template>
  <div id="app">
    <Header />
    <div class="body">
      <FeedbackPage />
    </div>
  </div>
</template>

<script>
import FeedbackPage from "./components/FeedbackPage.vue";
import Header from './components/Header.vue'

import "ant-design-vue/dist/antd.css"

export default {
  name: 'App',
  components: {
    Header,
    FeedbackPage,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}

.body {
  padding-top: 100px;
  padding-left: 20px;
  padding-right: 20px;
}
</style>
