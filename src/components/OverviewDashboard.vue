<template>
  <div>
    <div class="overview-dashboard-description">
      <div class="overview-dashboard-label">{{$t("dashboard.overview.section")}}</div>
      <Select
        :defaultValue="defaultValue"
        class="overview-dashboard-select"
        @change="handleChangeSection"
      >
        <Option :key="defaultValue" :value="defaultValue">{{$t("dashboard.overview.default")}}</Option>
        <Option
          v-for="section in sections"
          :key="section.id"
          :value="section.id"
        >{{section.title}}</Option>
      </Select>
    </div>
    <PieChart :chartData="pieChartData" :width="300" :height="300" :options="pieChartOptions" />
  </div>
</template>

<script>
import { Select } from "ant-design-vue";

import { DASHBOARD_LABELS_LIST, DASHBOARD_PIE_COLORS, DEFAULT } from "../config";
import PieChart from "./chart/PieChart";

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
      },
      defaultValue: DEFAULT
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

  .overview-dashboard-label {
    margin-right: 10px;
    color: rgba(0, 0, 0, 0.65)
  }

  .overview-dashboard-select {
    width: 200px;
  }
}
</style>

