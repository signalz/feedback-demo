<template>
  <div class="menu-wrapper">
    <BarMenu
      class="bar-menu"
      v-bind:class="{sideBarOpen: isOpen}"
      :isOpen="isOpen"
      @open="handleBarMenu"
    />
    <SideMenu
      class="side-menu"
      v-bind:class="{visible: isOpen}"
      :projects="projects"
      :selectedProject="selectedProject"
      @selectProject="handleSelectProject"
    />
    <Loading :isSpin="false" v-if="isOpen" class="menu-loading-wrapper" />
  </div>
</template>
<script>
import BarMenu from "./BarMenu";
import Loading from "./Loading";
import SideMenu from "./SideMenu";

export default {
  name: "Menu",
  components: {
    BarMenu,
    Loading,
    SideMenu
  },
  props: {
    projects: Array,
    selectedProject: String
  },
  data: () => {
    return {
      isOpen: false
    };
  },
  methods: {
    handleBarMenu({ isOpen }) {
      this.isOpen = isOpen;
    },

    handleSelectProject({ id }) {
      this.$emit("selectProject", { id });
      this.isOpen = false;
    }
  }
};
</script>
<style scoped lang="scss">
@media screen and (max-width: $extra-small-phone-width) {
  .sideBarOpen {
    margin-left: 250px !important;
  }
}

@media screen and (max-width: $desktop-width) {
  .side-menu {
    display: none;
  }
}

@media screen and (min-width: $desktop-width) {
  .bar-menu {
    display: none;
  }

  .menu-loading-wrapper {
    display: none;
  }
}

.sideBarOpen {
  margin-left: $side-menu-width;
}

.visible {
  display: block !important;
}
</style>
