<template>
  <div class="side-menu-wrapper">
    <!--
    <div class="side-menu-logo">
      <img :src="nttLogo" />
    </div>
    -->
    <div class="side-menu-header">
      <div class="side-menu-app-name-first">{{$t('app.name.first')}}</div>
      <div class="side-menu-app-name-second">{{$t('app.name.second')}}</div>
      <div class="side-menu-app-name-third">{{$t('app.name.third')}}</div>
    </div>
    <div class="side-menu-project-manager">
      <div class="side-menu-row">
        <div class="side-menu-project-manager-label">{{$t('menu.side.manager')}}</div>
        <div class="side-menu-project-manager-name">{{selectedProject.manager}}</div>
      </div>
      <div
        class="side-menu-row"
        v-if="event && state != feedbackStates.NEW_FEEDBACK && projectName"
      >
        <div class="side-menu-project-manager-label">{{$t('menu.bar.event-label')}}</div>
        <div class="side-menu-project-manager-name">{{event || $t('menu.bar.no-event')}}</div>
      </div>
      <div
        class="side-menu-row"
        v-else-if="state != feedbackStates.NEW_FEEDBACK && projectName && state != feedbackStates.NO_FEEDBACK"
      >
        <div class="side-menu-project-manager-label">{{$t('menu.bar.no-event-label')}}</div>
        <div class="side-menu-project-manager-name">{{createdAtValue}}</div>
      </div>
    </div>
    <div class="side-menu-search">
      <div class="side-menu-search-box">
        <div>{{$t('menu.side.projects-list')}}</div>
        <input :placeholder="$t('menu.side.projects-search')" @input="debounceInput" />
      </div>
      <div class="side-menu-projects">
        <div v-if="filterProject.length > 0">
          <SelectableItem
            v-for="project in filterProject"
            :key="project.id"
            :name="project.name"
            :id="project.id"
            :selected="project.id === selectedProject.id"
            @itemSelect="handleProjectSelect"
          />
          <SelectableItem
            :key="defaultValue"
            :name="$t('menu.side.project-all')"
            :id="defaultValue"
            :selected="selectedProject.id === defaultValue"
            @itemSelect="handleProjectSelect"
          />
        </div>
        <div class="side-menu-no-data" v-else>{{$t('menu.side.no-data')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { DEFAULT, FEEDBACK_STATE } from "../config";
import SelectableItem from "./SelectableItem";
import moment from "moment";
import nttLogo from "../assets/nttdata-logo.png";


export default {
  name: "SideMenu",
  components: {
    SelectableItem,
  },
  props: {
    projects: Array,
    event: String,
    state: String,
    createdAt: String,
    projectName: String,
    selectedProject: {
      type: Object,
      default: () => {
        return {
          id: String,
          name: String,
          manager: String
        };
      }
    }
  },
  computed: {
    filterProject() {
      return this.projects.filter(prj =>
        prj.name.toLocaleLowerCase().includes(this.filterKey)
      );
    },

    createdAtValue() {
      return moment(this.createdAt).format("YYYY-MM-DD");
    }
  },
  data: () => {
    return {
      filterKey: "",
      timeout: undefined,
      defaultValue: DEFAULT,
      nttLogo,
      feedbackStates: FEEDBACK_STATE
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
    width: $minimum-side-menu-width !important;

    .side-menu-project-manager {
      margin-top: 40px !important;
    }

    .side-menu-header {
      .side-menu-app-name-third {
        font-size: 16px !important;
      }
    }
  }
}

.side-menu-wrapper {
  background-color: $primary-color;
  height: 100%;
  z-index: 99;
  position: fixed;
  width: $side-menu-width;

  .side-menu-logo {
    height: 60px;
    justify-content: center;
    align-items: center;
    display: flex;
    img {
      width: 150px;
    }
  }

  .side-menu-header {
    display: flex;
    margin: 10px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;

    .side-menu-app-name-first {
      text-transform: uppercase;
      font-size: 18px;
      font-weight: bold;
    }

    .side-menu-app-name-second {
      font-size: 18px;
      font-weight: 600;
    }

    .side-menu-app-name-third {
      font-size: 18px;
    }
  }

  .side-menu-project-manager {
    margin-top: 80px;
    display: flex;
    padding: 0 10px 0 10px;
    font-size: 16px;
    flex-direction: column;

    .side-menu-row {
      align-items: center;
      display: flex;
    }

    .side-menu-project-manager-label {
      margin-right: 20px;
    }
  }

  .side-menu-search {
    margin: 0 10px 20px 10px;
    height: calc(100% - 350px);

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
    border: 2px solid #16619c;
    border-radius: 5px;
  }

  .side-menu-no-data {
    text-align: center;
    color: #16619c;
    font-size: 20px;
    margin: 20px;
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

