<template>
  <Icon :type="type" :theme="selected ? 'twoTone': 'outlined'" class="rating-icon" @click="rating" />
</template>

<script>
import { Icon } from "ant-design-vue";
export default {
  name: "FeedbackIcon",
  components: {
    Icon
  },
  props: {
    type: String,
    selected: Boolean,
    ratingId: Number
  },
  methods: {
    rating() {
      this.$emit("ratechange", { ratingId: this.ratingId });
    }
  }
};
</script>

<style scoped>
.rating-icon {
  cursor: pointer;
}
</style>
