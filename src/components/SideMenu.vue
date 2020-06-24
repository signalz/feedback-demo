<template>
  <div class="side-menu-wrapper">
    <div class="side-menu-header">
      <div class="side-menu-app-name-first">{{$t('app.name.first')}}</div>
      <div class="side-menu-app-name-second">{{$t('app.name.second')}}</div>
    </div>
    <div class="side-menu-project-manager">
      <div class="side-menu-project-manager-label">{{$t('sideMenu.manager')}}</div>
      <div class="side-menu-project-manager-name">{{manager}}</div>
    </div>
    <div class="side-menu-search">
      <div class="side-menu-search-box">
        <div>{{$t('sideMenu.yourProjects')}}</div>
        <input :placeholder="$t('sideMenu.searchProject')" @input="debounceInput" />
      </div>
      <div class="side-menu-projects">
        <SelectableItem
          v-for="project in projects.filter(prj => prj.projectName.toLocaleLowerCase().includes(filterKey))"
          :key="project.id"
          :name="project.projectName"
          :id="project.id"
          :selected="project.id === selectedProject"
          @itemSelect="handleProjectSelect"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SelectableItem from "./SelectableItem";

export default {
  name: "SideMenu",
  components: {
    SelectableItem
  },
  props: {
    projects: Array,
    selectedProject: String,
    manager: String,
  },
  data: () => {
    return {
      filterKey: "",
      timeout: undefined
    };
  },
  methods: {
    handleProjectSelect({ id }) {
      this.$emit("selectProject", { id });
    },

    debounceInput(e) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => (this.filterKey = e.target.value), 500);
    }
  }
};
</script>

<style scoped lang="scss">
@media screen and (max-width: $extra-small-phone-width) {
  .side-menu-wrapper {
    width: 250px !important;

    .side-menu-header {
      .side-menu-app-name-first {
        font-size: 18px !important;
      }

      .side-menu-app-name-second {
        font-size: 24px !important;
      }
    }
  }
}

.side-menu-wrapper {
  background-color: $primary-color;
  height: 100vh;
  z-index: 99;
  position: fixed;
  width: $side-menu-width;

  .side-menu-header {
    display: flex;
    margin: 20px 10px 20px 10px;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .side-menu-app-name-first {
      text-transform: uppercase;
      font-size: 22px;
    }

    .side-menu-app-name-second {
      font-size: 26px;
      text-transform: uppercase;
      font-weight: 600;
    }
  }

  .side-menu-project-manager {
    margin-top: 100px;
    display: flex;
    padding: 0 10px 0 10px;
    font-size: 16px;
    align-items: center;

    .side-menu-project-manager-label {
      margin-right: 20px;
    }
  }

  .side-menu-search {
    margin: 0 10px 20px 10px;
    height: 70%;

    .side-menu-search-box {
      display: flex;
      align-items: center;

      input {
        margin-left: 10px;
        background-color: $primary-color;
        border: none;
        color: #bfbfbf;
        border-bottom: 1px solid;
      }

      input:focus {
        outline: none;
      }

      input::placeholder {
        color: #bfbfbf;
      }
    }
  }

  .side-menu-projects {
    overflow-y: auto;
    height: 100%;
    margin-top: 5px;
    background-color: #c6d9f1;
  }
}

::-webkit-scrollbar {
  width: 5px;
  background: #424242;
}

::-webkit-scrollbar-thumb {
  background: #616161;
  border-radius: 20px;
}
</style>

