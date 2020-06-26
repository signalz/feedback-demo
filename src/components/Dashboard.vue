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
      <div>
        <HistoryDashboard
          :sections="sections"
          :data="lineChartData"
          @changeSection="handleChangeSectionHistory"
        />
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
    lineChartData: Array
  },
  methods: {
    handleChangeSection({ sectionId }) {
      this.$emit("changeOverviewSection", { sectionId });
    },

    handleChangeSectionHistory({ sections }) {
      this.$emit("changeHistorySection", { sections });
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
