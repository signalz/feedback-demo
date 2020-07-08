<template>
  <div>
    <div class="history-dashboard-description">
      <div class="history-dashboard-description-label">
        {{ $t("dashboard.history.sections") }}
      </div>
      <Group :value="checkboxesValues">
        <Select
          :open="isOpen"
          @mousedown.native="handleClickSelect"
          @blur.native="handleBlurSelect"
          :value="$t('dashboard.history.select-below')"
          class="history-dashboard-description-select"
        >
          <Option value="select-all" @click.native="handleSelect">
            <Button type="primary" style="width: 100%">{{
              $t("dashboard.history.select-all")
            }}</Button>
          </Option>
          <Option :value="defaultValue" @click.native="handleSelect">
            <Checkbox :value="defaultValue">{{
              $t("dashboard.history.default")
            }}</Checkbox>
          </Option>
          <Option
            v-for="section in sections"
            :key="section.id"
            :value="section.id"
            @click.native="handleSelect"
          >
            <Checkbox :value="section.id">{{ section.title }}</Checkbox>
          </Option>
        </Select>
      </Group>
    </div>
    <LineChart
      v-if="isDataAvailable"
      :chartData="lineChartData"
      :options="lineChartOptions"
      :width="300"
      :height="300"
    />
    <div v-else class="history-dashboard-no-data">
      {{ $t("dashboard.history.no-data") }}
    </div>
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
    handleClickSelect() {
      this.isOpen = !this.isOpen;
    },

    handleBlurSelect() {
      this.isOpen = false;
    },

    handleSelect(e) {
      e.domEvent.preventDefault();
      if (e.key === "select-all") {
        this.checkboxesValues = this.sections
          .map(section => section.id)
          .concat(DEFAULT);
      } else {
        if (this.checkboxesValues.includes(e.key)) {
          this.checkboxesValues = this.checkboxesValues.filter(
            val => val !== e.key
          );
        } else {
          this.checkboxesValues = this.checkboxesValues.concat(e.key);
        }
      }

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
      if (this.data && this.data.length > 0) {
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
    },

    isDataAvailable() {
      let isAvailable = false;
      if (this.data && this.data.length > 0) {
        this.data.map(lineItem => {
          if (lineItem.data.length > 0) {
            isAvailable = true;
          }
        });
      } else {
        isAvailable = false;
      }

      return isAvailable;
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
      defaultValue: DEFAULT,
      isOpen: false
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
