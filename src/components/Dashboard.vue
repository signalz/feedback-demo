<template>
  <div>
    <div class="dashboards-wrapper">
      <div class="dashboards-overview">
        <OverviewDashboard
          :sections="sections"
          :data="pieChartData"
          @changeSection="handleChangeSection"
        />
      </div>
      <div >
        <HistoryDashboard :sections="sections" />
      </div>
    </div>
  </div>
</template>

<script>
import HistoryDashboard from "./HistoryDashboard";
import OverviewDashboard from "./OverviewDashboard";

export default {
  name: "Dashboard",
  components: {
    HistoryDashboard,
    OverviewDashboard
  },
  props: {
    sections: Array,
    pieChartData: Array,
  },
  methods: {
    handleChangeSection({ sectionId }) {
      console.log(sectionId, '?????????????????????')
    }
  }
};
</script>

<style scoped lang="scss">
.dashboards-wrapper {
  .dashboards-overview {
    padding-bottom: 50px;
  }
}
</style>
