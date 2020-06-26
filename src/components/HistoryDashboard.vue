<template>
  <div>
    <div class="history-dashboard-description">
      <div class="history-dashboard-description-right">
        <div style="margin-right: 10px">History of: </div>
        <Group @change="onChange" :value="value">
          <Select style="width: 200px" value="Select below">
            <Option value="select-all"><Button type="primary" style="width: 100%" @click="onSelectAll">Select all</Button></Option>
            <Option value="overview"><Checkbox value="overview">Overview</Checkbox></Option>
            <Option v-for="section in sections" :key="section.id" :value="section.id">
              <Checkbox :value="section.id">{{section.title}}</Checkbox>
            </Option>
          </Select>
        </Group>
      </div>
    </div>
    <LineChart :chartData="lineChartData" :options="lineChartOptions" :width="300" :height="300" />
  </div>
</template>

<script>
import { Checkbox, Select, Button } from "ant-design-vue";
import LineChart from "./LineChart";

const { Group } = Checkbox;
const { Option } = Select

export default {
  name: "HistoryDashboard",
  components: {
    LineChart,
    Group,
    Checkbox,
    Select,
    Option,
    Button
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
  methods: {
    onChange(value) {
      this.value = value
      this.$emit('changeSection', { sections: this.value })
    },

    onSelectAll() {
      this.value = this.sections.map(section => section.id).concat('overview')
      this.$emit('changeSection', { sections: this.value })
    }
  },
  computed: {
    lineChartData() {
      return {
        labels: this.data.length > 0 ? this.data[0].map(item => item.date): [],
        // datasets: [
        //   {
        //     data: this.data.map(item => item.rating),
        //     borderColor: "rgba(54, 162, 235, 0.2)",
        //     fill: false
        //   }
        // ],
        datasets: this.data.map(item => ({
          data: item.map(data => data.rating),
          borderColor: "rgba(54, 162, 235, 0.2)",
          fill: false
        }))
      }
    }
  },
  data: () => {
    return {
      lineChartOptions: {
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              ticks: {
                min: 1
              }
            }
          ]
        }
      },
      value: ['overview']
    };
  }
};
</script>

<style scoped lang="scss">

@media screen and(max-width: $phone-width) {
  .history-dashboard-description-right {
    width: 100%;
    justify-content: space-between;
    margin-bottom: 20px;
  }
}

.history-dashboard-description {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  min-width: $min-width;
  margin-bottom: 20px;
  color: rgba(0, 0, 0, 0.65);

  .history-dashboard-description-text {
    margin-right: 10px;
  }

  .history-dashboard-description-right {
    display: flex;
    align-items: center;
  }

  .history-dashboard-select {
    width: 150px;
  }
}
</style>

