<template>
  <div class="side-menu-wrapper">
    <div class="side-menu-header">
      <img alt="logo" src="../assets/logo.png" class="side-menu-logo" />
      <div class="side-menu-app-name">{{$t('app.name')}}</div>
    </div>
    <div class="side-menu-navigation">
      <router-link to="/" @click.native="handleNavigation">{{$t('header.nav.feedback')}}</router-link>
      <router-link to="/dashboard" @click.native="handleNavigation">{{$t('header.nav.dashboard')}}</router-link>
    </div>
    <div v-if="isFeedback" class="side-menu-search">
      <div>{{$t('sideMenu.yourProjects')}}</div>
      <input :placeholder="$t('sideMenu.searchProject')" @input="debounceInput" />
      <div class="side-menu-projects">
        <SelectableItem
          v-for="project in projects.filter(prj => prj.projectName.toLocaleLowerCase().includes(filterKey))"
          :key="project.id"
          :name="project.projectName"
          :id="project.id"
          :selected="project.selected"
          @itemSelect="handleProjectSelect"
        />
      </div>
    </div>
    <div v-if="!isFeedback" class="side-menu-dashboard">
      <SelectableItem
        v-for="section in dashboardSections"
        :key="section.id"
        :name="$t(section.label)"
        :id="section.id"
        :selected="section.id === selectedSection"
        @itemSelect="handleDashboardSectionSelect"
      />
    </div>
  </div>
</template>

<script>
import SelectableItem from "./SelectableItem";
import { DASHBOARD_SECTIONS } from "../config";

export default {
  name: "SideMenu",
  components: {
    SelectableItem
  },
  props: {
    projects: Array
  },
  mounted() {
    if (this._routerRoot._route.path === "/dashboard") {
      this.isFeedback = false;
    } else {
      this.isFeedback = true;
    }
  },
  data: () => {
    return {
      isFeedback: true,
      filterKey: "",
      timeout: undefined,
      dashboardSections: DASHBOARD_SECTIONS,
      selectedSection: DASHBOARD_SECTIONS[0].id
    };
  },
  methods: {
    handleProjectSelect({ id }) {
      this.projects = this.projects.map(prj => {
        if (prj.id === id) {
          return {
            ...prj,
            selected: true
          };
        }

        return {
          ...prj,
          selected: false
        };
      });
    },

    handleDashboardSectionSelect({ id }) {
      this.selectedSection = id;
    },

    handleNavigation() {
      if (this._routerRoot._route.path === "/dashboard") {
        this.isFeedback = false;
      } else {
        this.isFeedback = true;
      }
    },

    debounceInput(e) {
      console.log(e)
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => this.filterKey = e.target.value, 500)
    }
  }
};
</script>

<style scoped lang="scss">
.side-menu-wrapper {
  background-color: #22282d;
  height: 100vh;
  z-index: 99;
  position: fixed;
  width: $side-menu-width;

  .side-menu-header {
    display: flex;
    margin: 20px;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .side-menu-logo {
      width: 150px;
    }

    .side-menu-app-name {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      text-transform: uppercase;
      margin-top: 10px;
    }
  }

  .side-menu-navigation {
    font-size: 24px;
    a {
      font-weight: bold;
      color: #5f778e;
      margin-left: 20px;
    }

    a.router-link-exact-active {
      color: #42b983;
    }
  }

  .side-menu-search {
    color: #a7a9ab;
    margin: 20px;
    height: 60%;

    input {
      background-color: #22282d;
      border: none;
      border-bottom: 1px solid;
      width: 100%;
      margin-top: 10px;
    }

    input:focus {
      outline: none;
    }
  }

  .side-menu-projects {
    overflow-y: auto;
    height: 100%;
    margin-top: 5px;
  }

  .side-menu-dashboard {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 150px;
    font-size: 16px;
    padding: 20px;

    .side-menu-dashboard-item:hover {
      background-color: #22282d;
      opacity: 0.5;
      cursor: pointer;
    }
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

