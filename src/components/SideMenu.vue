<template>
  <div class="side-menu-wrapper">
    <div class="side-menu-header">
      <img alt="logo" src="../assets/logo.png" class="side-menu-logo" />
      <div class="side-menu-app-name">{{$t('app.name')}}</div>
    </div>
    <div>
      <select>
        <option>123</option>
        <option>456</option>
      </select>
    </div>
    <div class="side-menu-search">
      <div>Your projects:</div>
      <input placeholder="Search a project" />
      <div class="side-menu-projects">
        <ProjectItem
          v-for="project in projects"
          :key="project.id"
          :name="project.name"
          :id="project.id"
          :selected="project.selected"
          @projectSelect="handleProjectSelect"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ProjectItem from "./ProjectItem";
import { PROJECTS } from "../config";

export default {
  name: "SideMenu",
  components: {
    ProjectItem
  },
  data: () => {
    return {
      projects: PROJECTS
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
    }
  }
};
</script>

<style scoped lang="scss">
.side-menu-wrapper {
  background-color: #22282d;
  height: 100vh;
  width: 329px;
  z-index: 99;
  position: fixed;

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

