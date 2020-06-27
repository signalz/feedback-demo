<template>
  <div>
    <div class="overview-dashboard-description">
      <div class="overview-dashboard-text">{{$t("dashboard.overview.section")}}</div>
      <Select
        defaultValue="default"
        class="overview-dashboard-select"
        @change="handleChangeSection"
      >
        <Option key="select-section-default" value="default">{{$t("dashboard.overview.default")}}</Option>
        <Option
          v-for="section in sections"
          :key="`select-section-${section.id}`"
          :value="section.id"
        >{{section.title}}</Option>
      </Select>
    </div>
    <PieChart :chartData="pieChartData" :width="300" :height="300" :options="pieChartOptions" />
  </div>
</template>

<script>
import { Select } from "ant-design-vue";
import PieChart from "./chart/PieChart";

import { DASHBOARD_LABELS_LIST, DASHBOARD_PIE_COLORS } from "../config";

const { Option } = Select;

export default {
  name: "OverviewDashboard",
  components: {
    Option,
    PieChart,
    Select,
  },
  props: {
    sections: {
      type: Array,
      default: () => {
        return [];
      }
    },
    data: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  computed: {
    pieChartData() {
      return  {
        datasets: [
          {
            data: this.data,
            backgroundColor: DASHBOARD_PIE_COLORS,
            hoverBackgroundColor: DASHBOARD_PIE_COLORS,
            borderWidth: 1
          }
        ],
        labels: DASHBOARD_LABELS_LIST
      }
    }
  },
  data: () => {
    return {
      pieChartOptions: {
        maintainAspectRatio: false
      }
    };
  },
  methods: {
    handleChangeSection(sectionId) {
      this.$emit("changeSection", { sectionId });
    }
  }
};
</script>

<style scoped lang="scss">
.overview-dashboard-description {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: rgba(0, 0, 0, 0.65);

  .overview-dashboard-text {
    margin-right: 10px;
    color: rgba(0, 0, 0, 0.65)
  }

  .overview-dashboard-select {
    width: 150px;
    margin-left: 10px;
  }
}
</style>

