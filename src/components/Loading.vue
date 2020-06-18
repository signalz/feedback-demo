<template>
  <div class="loading-wrapper">
    <div v-if="isSpin" class="loading-content"></div>
  </div>
</template>
<script>
export default {
  name: "Loading",
  props: {
    isSpin: Boolean
  }
};
</script>
<style scoped lang="scss">
.loading-wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 9;

  .loading-content {
    display: block;
    position: relative;
    left: 50%;
    top: 50%;
    width: 170px;
    height: 170px;
    margin: -85px 0 0 -85px;
    border: 3px solid transparent;
    border-top-color: #42b983;
    border-bottom-color: #42b983;
    border-radius: 50%;
    -webkit-animation: loader 2s linear infinite;
    -moz-animation: loader 2s linear infinite;
    -o-animation: loader 2s linear infinite;
    animation: loader 2s linear infinite;
  }
}
@keyframes loader {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
