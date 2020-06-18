<template>
  <div>
    <Menu />
    <div style="padding-top: 100px; color: red">This is NotFound page</div>
  </div>
</template>

<script>
import Menu from "./Menu.vue";

export default {
  name: "NotFoundPage",
  components: {
    Menu
  }
};
</script>

<style scoped>
</style>

