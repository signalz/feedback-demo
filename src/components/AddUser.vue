<template>
  <div class="add-user-wrapper">
    Add User
  </div>
</template>
<script>


export default {
  name: "AddUser",
  components: {
    
  },
  data: () => {
    return {
      isOpen: false
    };
  },
  methods: {
    handleBarMenu({ isOpen }) {
      this.isOpen = isOpen;
    }


  }
};
</script>
<style scoped lang="scss">


</style>
