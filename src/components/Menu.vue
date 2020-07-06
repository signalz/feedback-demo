<template>
  <div class="menu-wrapper">
    <BarMenu
      class="bar-menu"
      v-bind:class="{sideBarOpen: isOpen}"
      :project="projectName"
      :isOpen="isOpen"
      :event="eventName"
      @open="handleBarMenu"
    />
    <SideMenu
      class="side-menu"
      v-bind:class="{visible: isOpen}"
      :projects="projects"
      :event="eventName"
      :selectedProject="selectedProject"
      @selectProject="handleSelectProject"
    />
    <Loading :isSpin="false" v-if="isOpen" class="menu-loading-wrapper loading-invisible-desktop" />
  </div>
</template>
<script>
import { DEFAULT } from "../config";

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
  computed: {
    projectName: function() {
      return this.selectedProject.id === DEFAULT
        ? ""
        : this.selectedProject.name;
    }
  },
  props: {
    projects: {
      type: Array,
      default: () => {
        return [];
      }
    },
    selectedProject: {
      type: Object,
      default: () => {
        return {
          name: String,
          id: String
        };
      }
    },
    eventName: String
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
.menu-wrapper {
  .bar-menu-button {
    display: none;
  }
  .side-menu {
    display: none;
  }

  @media screen and (min-width: $desktop-width) {
    .bar-menu {
      padding-left: $side-menu-width;
    }

    .side-menu {
      display: inline;
    }
  }
}

@media screen and (max-width: $extra-small-phone-width) {
  .sideBarOpen {
    padding-left: $minimum-side-menu-width !important;
  }
}

@media screen and (max-width: $desktop-width) {
  .sideBarOpen {
    padding-left: $side-menu-width;
  }
}

@media screen and (min-width: $desktop-width) {
  .loading-invisible-desktop {
    display: none;
  }
}

.visible {
  display: block !important;
}
</style>
