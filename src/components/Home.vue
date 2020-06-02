<template>
  <div>
    <div>
      <Row>
        <Col v-bind:span="2">No</Col>
        <Col v-bind:span="16">Question</Col>
        <Col v-bind:span="6">Rating</Col>
      </Row>
      <span>Section</span>
      <span>Question</span>
      <span>Rating</span>
    </div>
    <FeedbackIcon v-for="rating in ratings" v-bind:key="rating.rate" v-bind:type="rating.icon" />
  </div>
</template>

<script>
// eslint-disable
import { Row, Col } from "ant-design-vue";
import FeedbackIcon from "./FeedbackIcon.vue";
import { RATINGS } from "../config";

export default {
  name: "Home",
  components: {
    FeedbackIcon,
    Row,
    Col,
  },
  data: () => {
    return {
      ratings: RATINGS
    };
  }
};
</script>

<style scoped>
</style>
