<template>
  <div class="feedback-icon" :draggable="false">
    <img v-bind:src="getImgSrc(type, selected)" @click="rating" :draggable="false" />
  </div>
</template>

<script>
import { getIconImgSrc } from "../utils";

export default {
  name: "FeedbackIcon",
  props: {
    type: String,
    selected: Boolean,
    ratingId: Number
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

  img {
    width: 25px;
    cursor: pointer;
  }
}
</style>
