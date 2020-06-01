<template>
  <icon :type="type" v-bind:class="{selected: selected}" />
</template>

<script>
import { Icon } from "ant-design-vue";
export default {
  name: "FeecbackIcon",
  components: {
    Icon
  },
  props: {
    type: String,
    selected: Boolean
  }
};
</script>

<style scoped>
.selected {
  background-color: red;
}
</style>
