<template>
  <div class="project-item" @click="select">
    <div class="project-item-name">{{name}}</div>
    <div v-if="selected" class="project-item-selected"></div>
  </div>
</template>

<script>
export default {
  name: "ProjectItem",
  props: {
    name: String,
    id: String,
    selected: Boolean
  },
  methods: {
    select() {
      const { id } = this;
      this.$emit("projectSelect", { id });
    }
  }
};
</script>

<style scoped lang="scss">
.project-item {
  padding: 10px 5px 10px 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;

  .project-item-name {
    color: $default-color;
  }

  .project-item-selected {
    height: 10px;
    width: 10px;
    background-color: green;
    border-radius: 50%;
  }
}

.project-item:hover {
  background-color: #22282d;
  opacity: 0.5;
}
</style>

