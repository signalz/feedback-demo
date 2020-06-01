<template>
  <div id="app">
    <Home />
    <DatePicker />
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Home from "./components/Home.vue";
import { DatePicker } from "ant-design-vue";
import "ant-design-vue/dist/antd.css"

export default {
  name: 'App',
  components: {
    Home,
    DatePicker
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
  /* margin-top: 60px; */
}
</style>
