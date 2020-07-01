<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-label">{{$t('login.login-form')}}</div>
      <form class="login-form">
        <input type="text" :placeholder="$t('login.username')" />
        <input type="password" :placeholder="$t('login.pass')" />
        <button @click="onClickLogin" class="login-btn">{{$t('login.login')}}</button>
      </form>
    </div>
    <Loading :isSpin="true" v-if="isLoading" class="menu-loading-wrapper" />
  </div>
</template>
<script>
import { DEFAULT } from "../config";

import Loading from "./Loading";

export default {
  name: "Login",
  components: {
    Loading
  },
  data: () => {
    return {
      isLoading: false
    };
  },
  methods: {
    onClickLogin() {
      this.isLoading = true;
      this.$router.push('/')
    }
  }
};
</script>
<style scoped lang="scss">
.login-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #558ed5;
  display: flex;
  .login-container {
    margin: auto;
    background: white;
    width: 450px;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
    .login-form {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      width: 100%;
      height: 250px;
      padding: 40px;
      input {
        background: #f2f2f2;
        border: 0;
        padding: 15px;
        font-size: 14px;
        outline: 0;
        color: black;
        margin-bottom: 10px;
      }
      .login-btn {
        text-transform: uppercase;
        background: #16619c;
        border: 0;
        padding: 15px;
        color: #ffffff;
        font-size: 14px;
        outline: 0;
        cursor: pointer;
      }
    }
    .login-label {
      background: #16619c;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      font-weight: bold;
    }
  }
}
</style>
