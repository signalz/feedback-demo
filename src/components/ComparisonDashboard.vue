<template>
  <div>
    <div class="comparison-dashboard-description">
      <div class="comparison-dashboard-description-left">
        <div class="comparison-dashboard-description-text">{{$t("dashboard.comparison.section")}}</div>
        <Select defaultValue="default" class="comparison-dashboard-select">
          <Option
            key="select-section-default"
            value="default"
          >{{$t("dashboard.comparison.default")}}</Option>
          <Option
            v-for="section in sections"
            :key="`select-section-${section.id}`"
            :value="section.id"
          >{{section.title}}</Option>
        </Select>
      </div>
      <div class="comparison-dashboard-description-right">
        <div class="comparison-dashboard-description-text">{{$t("dashboard.comparison.sort")}}</div>
        <Select defaultValue="default" class="comparison-dashboard-select">
          <Option key="select-compare-default" value="default">{{$t("dashboard.comparison.name")}}</Option>
          <Option key="select-compare-asc" value="asc">{{$t("dashboard.comparison.pointAsc")}}</Option>
          <Option key="select-compare-desc" value="desc">{{$t("dashboard.comparison.pointDesc")}}</Option>
        </Select>
      </div>
    </div>
    <HorizontalBar :chartData="barChartData" :options="barChartOptions" :width="300" :height="300" />
  </div>
</template>

<script>
import { Select } from "ant-design-vue";
import HorizontalBar from "./HorizontalBar";

const { Option } = Select;

const BACKGROUND_COLORS = ["#cd7f32 ", "#aaa9ad", "#faf369", "#e5e4e2"]

export default {
  name: "ComparisonDashboard",
  components: {
    Option,
    HorizontalBar,
    Select
  },
  watch: {
    data: function(val) {
      this.barChartData = {
        datasets: [
          {
            backgroundColor: BACKGROUND_COLORS,
            data: val.map(item => Number.parseFloat(item.rating))
          }
        ],
        labels: val.map(item => item.projectName)
      };
    }
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
  mounted() {
    this.barChartData = {
      datasets: [
        {
          backgroundColor: BACKGROUND_COLORS,
          data: this.data.map(item => Number.parseFloat(item.rating))
        }
      ],
      labels: this.data.map(item => item.projectName)
    };
  },
  data: () => {
    return {
      barChartData: {
        datasets: [
          {
            backgroundColor: BACKGROUND_COLORS,
            data: []
          }
        ],
        labels: []
      },
      barChartOptions: {
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              ticks: {
                min: 1
              }
            }
          ],
          yAxes: [
            {
              stacked: true
            }
          ]
        }
      }
    };
  }
};
</script>

<style scoped lang="scss">
@media screen and(max-width: $phone-width) {
  .comparison-dashboard-description-left,
  .comparison-dashboard-description-right {
    width: 100%;
    justify-content: space-between;
    margin-bottom: 20px;
  }
}

.comparison-dashboard-description {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  min-width: $min-width;
  margin-bottom: 20px;

  .comparison-dashboard-description-left {
    display: flex;
    align-items: center;
  }

  .comparison-dashboard-description-text {
    margin-right: 10px;
  }

  .comparison-dashboard-description-right {
    display: flex;
    align-items: center;
  }

  .comparison-dashboard-select {
    width: 150px;
  }
}
</style>

