<template>
  <div class="mobile-menu-wrapper">
    <div class="first-bar" v-bind:class="{clicked: isClicked}"></div>
    <div class="second-bar" v-bind:class="{clicked: isClicked}"></div>
    <div class="third-bar" v-bind:class="{clicked: isClicked}"></div>
  </div>
</template>

<script>
export default {
  name: "MobileMenu",
  props: {
    isClicked: Boolean
  }
};
</script>

<style scoped lang="scss">
.mobile-menu-wrapper {
  display: inline-block;
  cursor: pointer;

  .first-bar,
  .second-bar,
  .third-bar {
    width: 35px;
    height: 5px;
    background-color: #2c3e50;
    margin: 6px 0;
    transition: 0.4s;
    position: relative;
  }

  .clicked.first-bar {
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    top: 10px;
  }

  .clicked.second-bar {
    opacity: 0;
  }

  .clicked.third-bar {
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    top: -11px;
  }
}
</style>

