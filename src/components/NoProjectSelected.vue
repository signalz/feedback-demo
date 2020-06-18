<template>
  <div class="no-project-selected">
    <div class="no-project-selected-header">{{$t("noProjectSelected.header")}}</div>
    <div class="no-project-selected-description">{{$t("noProjectSelected.description")}}</div>
  </div>
</template>
<script>
export default {
  name: "NoProjectSelected"
};
</script>
<style scoped lang="scss">
@media screen and (min-width: $desktop-width) {
  .no-project-selected {
    margin-left: 50px !important;
  }
}

.no-project-selected {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  left: 50%;
  -ms-transform: translateX(-50%);
  transform: translateX(-50%);

  .no-project-selected-header {
    color: #4e5357;
    font-size: 48px;
  }

  .no-project-selected-description {
    color: #7a7e81;
    font-size: 14px;
  }
}
</style>
