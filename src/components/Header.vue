<template>
  <div class="header">
    <img alt="logo" src="../assets/logo-big.png" class="header-logo" />
    <div class="header-nav">
      <router-link to="/">Feedback</router-link>
      <router-link to="/dashboard">Dashboard</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  components: {}
};
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
  z-index: 999;
  display: flex;
  justify-content: space-between;
}

.header-logo {
  height: 100%;
}

.header-nav {
  padding: 30px;
}

.header-nav a {
  font-weight: bold;
  color: #2c3e50;
  margin-left: 20px;
}

.header-nav a.router-link-exact-active {
  color: #42b983;
}
</style>
