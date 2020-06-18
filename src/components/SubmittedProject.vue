<template>
  <div class="submitted-project-wrapper">
    <div class="submitted-project-header">{{$t("submittedProject.header")}}</div>
    <div class="submitted-project-description">{{$t("submittedProject.description")}}</div>
  </div>
</template>
<script>
export default {
  name: "SubmittedProject"
};
</script>
<style scoped lang="scss">
.submitted-project-wrapper {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  left: 50%;
  -ms-transform: translateX(-50%);
  transform: translateX(-50%);

  .submitted-project-header {
    color: #4e5357;
    font-size: 48px;
  }

  .submitted-project-description {
    color: #7a7e81;
    font-size: 14px;
  }
}
</style>
