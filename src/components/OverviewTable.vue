<template>
  <div class="overview-table-wrapper">
    <Row>
      <Col span="8"></Col>
      <Col span="4" class="overview-table-header">
        <img src="../assets/bronze.png" />
      </Col>
      <Col span="4" class="overview-table-header">
        <img src="../assets/silver.png" />
      </Col>
      <Col span="4" class="overview-table-header">
        <img src="../assets/gold.png" />
      </Col>
      <Col span="4" class="overview-table-header">
        <img src="../assets/platinum.png" />
      </Col>
    </Row>
    <Row v-for="section in sections" :key="section.id" class="overview-table-row">
      <Col class="overview-table-section" span="8">{{section.title}}</Col>
      <Col class="overview-table-value" span="4">{{section.BRONZE || defaultValue}}</Col>
      <Col class="overview-table-value" span="4">{{section.SILVER || defaultValue}}</Col>
      <Col class="overview-table-value" span="4">{{section.GOLD || defaultValue}}</Col>
      <Col class="overview-table-value" span="4">{{section.PLATINUM || defaultValue}}</Col>
    </Row>
  </div>
</template>
<script>
import { Col, Row } from "ant-design-vue";

const DEFAULT_VALUE = 0;

export default {
  name: "OverviewTable",
  components: {
    Col,
    Row
  },
  props: {
    sections: Array
  },
  data: () => {
    return {
      defaultValue: DEFAULT_VALUE
    };
  }
};
</script>
<style scoped lang="scss">
.overview-table-wrapper {
  color: #999999;
  font-size: 15px;

  .overview-table-row {
    height: 30px;
    margin-top: 10px;
    border-bottom: 1px solid #f2f2f2;
  }

  .overview-table-value,
  .overview-table-header {
    text-align: center;

    img {
      width: 60px;
    }
  }

  .overview-table-section {
    color: #666666;
  }
}
</style>
