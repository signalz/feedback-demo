<template>
  <div>
    <div class="overview-dashboard-description">
      <div class="overview-dashboard-text">{{$t("dashboard.overview.section")}}</div>
      <Select defaultValue="default" class="overview-dashboard-select">
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
import PieChart from "./PieChart";

const { Option } = Select;

export default {
  name: "OverviewDashboard",
  components: {
    Option,
    PieChart,
    Select
  },
  updated() {
    this.pieChartData.datasets[0].data = this.data
    console.log(this.pieChartData)
    // this.$forceUpdate()
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
  data: () => {
    return {
      pieChartData: {
        datasets: [
          {
            // data: [1, 1, 1, 1],
            data: [],
            backgroundColor: ["#cd7f32 ", "#aaa9ad", "#faf369", "#e5e4e2"],
            hoverBackgroundColor: ["#cd7f32 ", "#aaa9ad", "#faf369", "#e5e4e2"],
            borderWidth: 1
          }
        ],
        labels: ["BRONZE", "SILVER", "GOLD", "PLATIN"]
      },
      pieChartOptions: {
        maintainAspectRatio: false
      }
    };
  }
};
</script>

<style scoped lang="scss">
.overview-dashboard-description {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .overview-dashboard-description-text {
    margin-right: 10px;
  }

  .overview-dashboard-select {
    width: 150px;
    margin-left: 10px;
  }
}
</style>

