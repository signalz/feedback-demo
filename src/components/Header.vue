<template>
  <div class="header-wrapper">
    <div class="header">
      <img alt="logo" src="../assets/logo-big.png" class="header-logo" />
      <div class="header-banner-text">{{$t('header.banner.text')}}</div>
      <div class="header-nav">
        <router-link to="/">{{$t('header.nav.feedback')}}</router-link>
        <router-link to="/dashboard">{{$t('header.nav.dashboard')}}</router-link>
      </div>
      <MobileMenuButton
        class="header-nav-mobile"
        :isClicked="isMobileMenuClicked"
        @click.native="onMobileMenuClick"
      />
    </div>
    <div class="header-banner-mobile-text">{{$t('header.banner.text')}}</div>
    <div class="menu-mobile-wrapper" v-if="isMobileMenuClicked">
      <div class="menu-mobile">
        <router-link to="/" @click.native="onMobileMenuClick">{{$t('header.nav.feedback')}}</router-link>
        <router-link to="/dashboard" @click.native="onMobileMenuClick">{{$t('header.nav.dashboard')}}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import MobileMenuButton from "./MobileMenuButton";

export default {
  name: "Header",
  components: {
    MobileMenuButton
  },
  data: () => {
    return {
      isMobileMenuClicked: false
    };
  },
  methods: {
    onMobileMenuClick() {
      this.isMobileMenuClicked = !this.isMobileMenuClicked;
    }
  }
};
</script>

<style scoped lang="scss">
.header-wrapper {
  min-width: $min-width;

  .header {
    min-width: $min-width;
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
      font-size: 22px;
      font-weight: bold;
    }

    .header-nav {
      padding-right: 30px;

      a {
        font-weight: bold;
        color: #2c3e50;
        margin-left: 20px;
      }

      a.router-link-exact-active {
        color: #42b983;
      }
    }

    .header-nav-mobile {
      padding-right: 30px;
    }
  }

  .header-banner-mobile-text {
    padding-top: $header-height;
    font-size: 15px;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
    width: 100%;
  }

  .menu-mobile-wrapper {
    font-size: 24px;
    position: fixed;
    top: $header-height;
    width: 100%;
    height: 90px;
    z-index: 99;

    .menu-mobile {
      display: flex;
      flex-direction: column;
      width: 90%;
      margin: auto;
      background-color: aliceblue;
      margin-top: 2px;
      height: 100%;
      justify-content: center;
      border-radius: 10px;
      box-shadow: 0 10px 15px 0 rgba(134, 134, 134, .15);

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

  @media screen and (max-width: $desktop-width) {
    .header-banner-text,
    .header-nav {
      display: none;
    }

    .header-banner-mobile-text,
    .header-nav-mobile {
      display: inline-block;
    }
  }

  @media screen and (min-width: $desktop-width) {
    .header-banner-mobile-text,
    .header-nav-mobile,
    .menu-mobile-wrapper {
      display: none;
    }
  }
}
</style>
