<template>
  <div class="over-view-all-prjs">
    <div class="over-view-all-prjs-headers">
      <div class="over-view-all-prjs-section"></div>
      <div class="over-view-all-prjs-header"><img src="../assets/bronze.png" /></div>
      <div class="over-view-all-prjs-header"><img src="../assets/silver.png" /></div>
      <div class="over-view-all-prjs-header"><img src="../assets/gold.png" /></div>
      <div class="over-view-all-prjs-header"><img src="../assets/platinum.png" /></div>
    </div>
    <div v-for="section in sections" :key="section.id" class="over-view-all-prjs-row">
      <div>{{section.title}}</div>
      <div>{{section.bronze || 0}}</div>
      <div>{{section.silver || 0}}</div>
      <div>{{section.gold || 0}}</div>
      <div>{{section.platin || 0}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Overview",
  props: {
    sections: Array
  }
};
</script>
<style scoped lang="scss">
.over-view-all-prjs {
  color: #000;

  .over-view-all-prjs-section {
    width: 25%;
  }

  .over-view-all-prjs-headers {
    display: flex;
    justify-content: space-between;

    .over-view-all-prjs-header {
      img {
        width: 60px;
      }
    }
  }

  .over-view-all-prjs-row {
    height: 30px;
    display: flex;
  }
}
</style>
