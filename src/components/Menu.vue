<template>
  <div class="menu-wrapper">
    <BarMenu class="bar-menu" v-bind:class="{sideBarOpen: isOpen}" @open="handleBarMenu" />
    <SideMenu class="side-menu" v-bind:class="{visible: isOpen}" :projects="projects" />
    <Loading :isSpin="false" v-if="isOpen" />
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
    projects: Array
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
@media screen and (max-width: $desktop-width) {
  .side-menu {
    display: none;
  }
}

@media screen and (min-width: $desktop-width) {
  .bar-menu {
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
