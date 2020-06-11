<template>
<div>
  <div class="header">
    <img alt="logo" src="../assets/logo-big.png" class="header-logo" />
    <div class="header-banner-text">Vietnam shoring team initiative evaluation</div>
    <div class="header-nav">
      <router-link to="/">Feedback</router-link>
      <router-link to="/dashboard">Dashboard</router-link>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "Header",
  components: {}
};
</script>

<style scoped lang="scss">
.header {
  height: $header-height;
  position: fixed;
  width: 100%;
  background-color: aliceblue;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 20px;
  font-size: 24px;
  z-index: 999;

  .header-logo {
    height: 100%;
  }

  .header-banner-text {
    text-transform: uppercase;
  }

  .header-nav {
    padding: 30px;

     a {
      font-weight: bold;
      color: #2c3e50;
      margin-left: 20px;
    }

    a.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
