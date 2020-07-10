<template>
  <div>
    <div class="dashboards-wrapper">
      <div class="dashboards-overview">
        <OverviewDashboard
          :sections="sections"
          :data="overviewData"
          @changeSection="handleChangeSection"
        />
      </div>
      <div>
        <HistoryDashboard
          :sections="sections"
          :data="historyData"
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
    overviewData: Array,
    historyData: Array
  },
  methods: {
    handleChangeSection({ sectionTitle }) {
      this.$emit("changeOverviewSection", { sectionTitle });
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
