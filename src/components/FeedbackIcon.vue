<template>
  <div class="feedback-icon" :draggable="false">
    <img v-bind:src="getImgSrc(type, selected)" @click="rating" :draggable="false" />
  </div>
</template>

<script>
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
      switch (type) {
        case "1":
          if (selected) {
            return require("../assets/icons/bronze-medal-selected.png");
          } else {
            return require("../assets/icons/bronze-medal.png");
          }
        case "2":
          if (selected) {
            return require("../assets/icons/silver-medal-selected.png");
          } else {
            return require("../assets/icons/silver-medal.png");
          }
        case "3":
          if (selected) {
            return require("../assets/icons/gold-medal-selected.png");
          } else {
            return require("../assets/icons/gold-medal.png");
          }
        case "4":
          if (selected) {
            return require("../assets/icons/trophy-selected.png");
          } else {
            return require("../assets/icons/trophy.png");
          }
      }
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
