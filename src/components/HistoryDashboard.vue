<template>
  <div>
    <div class="history-dashboard-description">
      <div class="history-dashboard-description-label">{{$t('dashboard.history.sections')}}</div>
      <Group @change="onChangeCheckboxes" :value="checkboxesValues">
        <Select
          :value="$t('dashboard.history.select-below')"
          class="history-dashboard-description-select"
        >
          <Option value="select-all">
            <Button
              type="primary"
              style="width: 100%"
              @click="onSelectAll"
            >{{$t('dashboard.history.select-all')}}</Button>
          </Option>
          <Option :value="defaultValue">
            <Checkbox :value="defaultValue">{{$t('dashboard.history.default')}}</Checkbox>
          </Option>
          <Option v-for="section in sections" :key="section.id" :value="section.id">
            <Checkbox :value="section.id">{{section.title}}</Checkbox>
          </Option>
        </Select>
      </Group>
    </div>
    <LineChart
      v-if="data.length > 0"
      :chartData="lineChartData"
      :options="lineChartOptions"
      :width="300"
      :height="300"
    />
    <div v-else class="history-dashboard-no-data">{{$t("dashboard.history.no-data")}}</div>
  </div>
</template>

<script>
import { Button, Checkbox, Select } from "ant-design-vue";

import { DEFAULT } from "../config";
import LineChart from "./chart/LineChart";

const { Group } = Checkbox;
const { Option } = Select;

const COLORS = [
  "rgba(54, 162, 235, 0.2)",
  "#cd7f32 ",
  "#aaa9ad",
  "#faf369",
  "#e5e4e2"
];

export default {
  name: "HistoryDashboard",
  components: {
    Button,
    Checkbox,
    Group,
    LineChart,
    Option,
    Select
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
        return [{ title: String, data: [{ date: String, rating: String }] }];
      }
    }
  },
  methods: {
    onChangeCheckboxes(value) {
      this.checkboxesValues = value;
      this.$emit("changeSection", {
        sections: this.checkboxesValues.map(ckValue => ({
          id: ckValue,
          title:
            ckValue === DEFAULT
              ? DEFAULT
              : this.sections.find(section => section.id === ckValue).title
        }))
      });
    },

    onSelectAll() {
      this.checkboxesValues = this.sections
        .map(section => section.id)
        .concat(DEFAULT);
      this.$emit("changeSection", {
        sections: this.checkboxesValues.map(ckValue => ({
          id: ckValue,
          title:
            ckValue === DEFAULT
              ? DEFAULT
              : this.sections.find(section => section.id === ckValue).title
        }))
      });
    }
  },
  computed: {
    lineChartData() {
      if (this.data.length > 0) {
        return {
          labels: this.data[0].data.map(item => item.date),
          datasets: this.data.map((item, idx) => ({
            data: item.data.map(data => data.rating),
            borderColor: COLORS[idx],
            label:
              item.title === DEFAULT
                ? this.$t("dashboard.history.default")
                : item.title,
            fill: false
          }))
        };
      } else {
        return {};
      }
    }
  },
  data: () => {
    return {
      lineChartOptions: {
        maintainAspectRatio: false,
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
      checkboxesValues: [DEFAULT],
      defaultValue: DEFAULT
    };
  }
};
</script>

<style scoped lang="scss">
.history-dashboard-description {
  display: flex;
  align-items: center;
  min-width: $min-width;
  margin-bottom: 20px;
  color: rgba(0, 0, 0, 0.65);

  .history-dashboard-description-label {
    margin-right: 10px;
  }

  .history-dashboard-description-select {
    width: 200px;
  }
}

.history-dashboard-no-data {
  color: rgba(0, 0, 0, 0.65);
}
</style>

