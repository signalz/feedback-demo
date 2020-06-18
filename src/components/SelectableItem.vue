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
  padding: 10px 5px 10px 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;

  .selectable-item-name {
    color: $default-color;
  }

  .selectable-item-selected {
    height: 10px;
    width: 10px;
    background-color: #42b983;
    border-radius: 50%;
  }
}

.selectable-item:hover {
  background-color: #22282d;
  opacity: 0.5;
}
</style>

