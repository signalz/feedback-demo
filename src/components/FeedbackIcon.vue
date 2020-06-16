<template>
  <div class="feedback-icon" :draggable="false">
    <Tooltip>
      <template slot="title">
        <span>{{label}}</span>
      </template>
      <img v-bind:src="getImgSrc(type, selected)" @click="rating" :draggable="false" />
    </Tooltip>
  </div>
</template>

<script>
import { Tooltip } from "ant-design-vue";

import { getIconImgSrc } from "../utils";

export default {
  name: "FeedbackIcon",
  components: {
    Tooltip
  },
  props: {
    type: String,
    selected: Boolean,
    ratingId: Number,
    label: String,
  },
  methods: {
    rating() {
      this.$emit("ratechange", { ratingId: this.ratingId });
    },
    getImgSrc(type, selected) {
      return getIconImgSrc(type, selected)
    }
  }
};
</script>

<style lang="scss" scoped>
.feedback-icon {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  background-image: url("../assets/medals.png");

  img {
    width: 25px;
    cursor: pointer;
  }
}
</style>
