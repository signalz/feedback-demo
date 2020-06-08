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
            return require('../assets/icons/zero-circle-selected.png')
          } else {
            return require('../assets/icons/zero-circle.png')
          }
        case '2':
          if (selected) {
            return require('../assets/icons/90-circle-selected.png')
          } else {
            return require('../assets/icons/90-circle.png')
          }
        case '3':
          if (selected) {
            return require('../assets/icons/180-circle-selected.png')
          } else {
            return require('../assets/icons/180-circle.png')
          }
        case '4':
          if (selected) {
            return require('../assets/icons/270-circle-selected.png')
          } else {
            return require('../assets/icons/270-circle.png')
          }
        case '5':
          if (selected) {
            return require('../assets/icons/full-circle-selected.png')
          } else {
            return require('../assets/icons/full-circle.png')
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
