<template>
<div>
  <img v-bind:src="getImgSrc(type, selected)" @click="rating" />
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
      switch(type) {
        case '1':
          if (selected) {
            return require('../assets/icons/bronze-medal-selected.png')
          } else {
            return require('../assets/icons/bronze-medal.png')
          }
        case '2':
          if (selected) {
            return require('../assets/icons/silver-medal-selected.png')
          } else {
            return require('../assets/icons/silver-medal.png')
          }
        case '3':
          if (selected) {
            return require('../assets/icons/gold-medal-selected.png')
          } else {
            return require('../assets/icons/gold-medal.png')
          }
        case '4':
          if (selected) {
            return require('../assets/icons/trophy-selected.png')
          } else {
            return require('../assets/icons/trophy.png')
          }
      }
    }
  }
};
</script>

<style scoped>
img {
  width: 25px;
  cursor: pointer;
}
</style>
