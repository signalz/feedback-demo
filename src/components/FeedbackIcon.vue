<template>
  <div class="feedback-icon" :draggable="false">
    <Tooltip>
      <template slot="title">
        <span>{{label}}</span>
      </template>
      <img
        v-bind:src="getImgSrc()"
        v-bind:class="{selected}"
        @click="onClickRating"
        :draggable="false"
      />
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
    selected: Boolean,
    rating: Number,
    label: String
  },
  methods: {
    onClickRating() {
      this.$emit("ratechange", { rating: this.rating });
    },
    getImgSrc() {
      return getIconImgSrc(this.label, this.selected);
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
    width: 50px;
    cursor: pointer;
    opacity: 0.5;
  }

  img.selected {
    opacity: 1;
  }
}
</style>
