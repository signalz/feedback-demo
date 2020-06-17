<template>
  <div class="loading-wrapper">
    <!-- <div class="loading-text">LOADING</div> -->
    <div class="loading-content"></div>
  </div>
</template>
<script>
export default {
  name: "Loading"
};
</script>
<style lang="scss">
.loading-wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 99;

  .loading-text {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    color: rgb(20, 121, 60);
    width: 100px;
    height: 30px;
    margin: -7px 0 0 -45px;
    text-align: center;
    font-family: "PT Sans Narrow", sans-serif;
    font-size: 20px;
  }
  .loading-content {
    display: block;
    position: relative;
    left: 50%;
    top: 50%;
    width: 170px;
    height: 170px;
    margin: -85px 0 0 -85px;
    // border: 3px solid #f00;
    border: 3px solid transparent;
    border-top-color: rgb(121, 61, 185);
    border-bottom-color: rgb(121, 61, 185);
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
