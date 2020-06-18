<template>
  <div class="bar-menu-wrapper">
    <MobileMenuButton
      class="header-nav-mobile"
      :isClicked="isOpen"
      @click.native="onMobileMenuClick"
    />
    <div class="bar-menu-app-name">{{$t('app.name')}}</div>
  </div>
</template>
<script>
import MobileMenuButton from "./MobileMenuButton";

export default {
  name: "BarMenu",
  components: {
    MobileMenuButton
  },
  props: {
    isOpen: Boolean
  },
  methods: {
    onMobileMenuClick() {
      this.$emit("open", { isOpen: !this.isOpen });
    }
  }
};
</script>
<style scoped lang="scss">
.bar-menu-wrapper {
  height: $header-height;
  position: fixed;
  width: 100%;
  background-color: #22282d;
  display: flex;
  align-items: center;
  padding: 0 20px 0 20px;
  font-size: 24px;
  z-index: 99;
  min-width: $min-width;

  @media screen and (max-width: $phone-width) {
    .bar-menu-app-name {
      font-size: 16px;
    }
  }

  .bar-menu-app-name {
    width: 90%;
    text-transform: uppercase;
    text-align: center;
  }
}
</style>
