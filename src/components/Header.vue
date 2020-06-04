<template>
  <div class="header">
    <img alt="logo" src="../assets/logo.png" class="logo">
    Feedback
  </div>
</template>

<script>
export default {
  name: 'Header',
  components: {
  }
}
</script>

<style scoped>
.header {
  position: fixed;
  width: 100%;
  height: 60px;
  background-color: aliceblue;
  display: flex;
  justify-content: left;
  align-items: center;
  padding-left: 20px;
  font-size: 24px;
}

.logo {
  height: 100%;
}
</style>
