<template>
  <div class="selectable-item" @click="select">
    <div class="selectable-item-name">{{name}}</div>
    <div v-if="selected" class="selectable-item-selected"></div>
  </div>
</template>

<script>
export default {
  name: "SelectableItem",
  props: {
    name: String,
    id: String,
    selected: Boolean
  },
  methods: {
    select() {
      const { id } = this;
      this.$emit("itemSelect", { id });
    }
  }
};
</script>

<style scoped lang="scss">
.selectable-item {
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;

  .selectable-item-name {
    color: #000;
    width: 80%;
    flex-wrap: wrap;
    word-break: break-all;
  }

  .selectable-item-selected {
    height: 10px;
    width: 10px;
    background-color: #ec4a70;
    border-radius: 50%;
  }
}

.selectable-item:hover {
  background-color: #417ce8;
  opacity: 0.5;
}
</style>

