<template>
  <div class="over-view-wrapper">
    <Row>
      <Col span="8"></Col>
      <Col span="4" class="over-view-header"><img src="../assets/bronze.png" /></Col>
      <Col span="4" class="over-view-header"><img src="../assets/silver.png" /></Col>
      <Col span="4" class="over-view-header"><img src="../assets/gold.png" /></Col>
      <Col span="4" class="over-view-header"><img src="../assets/platinum.png" /></Col>
    </Row>
    <Row v-for="section in sections" :key="section.id" class="over-view-row">
      <Col class="over-view-section" span="8">{{section.title}}</Col>
      <Col class="over-view-value" span="4">{{section.bronze || 0}}</Col>
      <Col class="over-view-value" span="4">{{section.silver || 0}}</Col>
      <Col class="over-view-value" span="4">{{section.gold || 0}}</Col>
      <Col class="over-view-value" span="4">{{section.platin || 0}}</Col>
    </Row>
  </div>
</template>
<script>
import { Row, Col } from "ant-design-vue";

export default {
  name: "Overview",
  props: {
    sections: Array
  },
  components: {
    Row,
    Col
  }
};
</script>
<style scoped lang="scss">
.over-view-wrapper {
  color: #999999;
  font-size: 15px;

  .over-view-row {
    height:30px;
    margin-top: 10px;
    border-bottom: 1px solid #f2f2f2;
  }

  .over-view-value,
  .over-view-header {
    text-align: center;

    img {
      width: 60px;
    }
  }

  .over-view-section {
    color: #666666;
  }
}
</style>
