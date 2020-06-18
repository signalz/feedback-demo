<template>
  <div>
    <Menu
      :sections="dashboardSections"
      :selectedSection="dashboardSelectedSection"
      @selectSection="handleSelectSection"
    />
    <Loading isSpin v-if="isLoading" />
    <div class="dashboards-wrapper">
      <div v-if="dashboardSelectedSection === dashboardSectionIds.OVERVIEW">
        <OverviewDashboard :sections="sections" />
      </div>
      <div v-if="dashboardSelectedSection === dashboardSectionIds.COMPARISON">
        <ComparisonDashboard :sections="sections" />
      </div>
      <div v-if="dashboardSelectedSection === dashboardSectionIds.HISTORY">
        <HistoryDashboard :sections="sections" :projects="projects" />
      </div>
    </div>
  </div>
</template>

<script>
import { message } from "ant-design-vue";

import ComparisonDashboard from "./ComparisonDashboard";
import HistoryDashboard from "./HistoryDashboard"
import Loading from "./Loading";
import Menu from "./Menu";
import OverviewDashboard from "./OverviewDashboard";
import { END_POINT, DASHBOARD_SECTION_ID, DASHBOARD_SECTIONS, SECTIONS } from "../config";

export default {
  name: "DashboardPage",
  components: {
    ComparisonDashboard,
    HistoryDashboard,
    Loading,
    Menu,
    OverviewDashboard
  },
  mounted() {
    Promise.all([
      fetch(`${END_POINT}/api/projects`).then(res => res.json())
      // fetch(`${END_POINT}/api/sections`).then(res => res.json())
    ])
      .then(([projects, sections]) => {
        if (sections && sections.length > 0) {
          this.sections = sections;
        }
        this.sections = SECTIONS;
        if (projects && projects.length > 0) {
          this.projects = projects;
        }
        this.isLoading = false;
      })
      .catch(e => {
        this.isLoading = false;
        this.message.error(e);
      });
  },
  data: () => {
    return {
      dashboardSections: DASHBOARD_SECTIONS,
      dashboardSelectedSection: DASHBOARD_SECTION_ID.OVERVIEW,
      dashboardSectionIds: DASHBOARD_SECTION_ID,
      isLoading: true,
      sections: [],
      message
    };
  },
  methods: {
    handleSelectSection({ id }) {
      this.dashboardSelectedSection = id;
    }
  }
};
</script>

<style scoped lang="scss">
@media screen and(min-width: $desktop-width) {
  .dashboards-wrapper {
    padding-left: 320px !important;
    padding-top: 50px !important;
  }
}

.dashboards-wrapper {
  padding-top: 100px;
  padding-left: 20px;
  color: #7a7e81;
  padding-right: 20px;
}
</style>
