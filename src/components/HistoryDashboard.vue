<template>
  <div>
    <div class="history-dashboard-description">
      <!-- <div class="history-dashboard-description-left">
        <div class="history-dashboard-description-text">{{$t("dashboard.history.project")}}</div>
        <Select :defaultValue="projects[0].id" class="history-dashboard-select">
          <Option
            v-for="project in projects"
            :key="`select-prj-${project.id}`"
            :value="project.id"
          >{{project.projectName}}</Option>
        </Select>
      </div>-->
      <div class="history-dashboard-description-right">
        <!-- <div class="history-dashboard-description-text">{{$t("dashboard.history.section")}}</div> -->
        <Group @change="onChange" :defaultValue="['overview']">
          <Row>
            <Col span="8">
              <Checkbox value="select-all">Select all</Checkbox>
            </Col>
            <Col span="8">
              <Checkbox value="overview">Overview</Checkbox>
            </Col>
            <Col v-for="section in sections" :key="section.id" span="8">
              <Checkbox :value="section.id">{{section.title}}</Checkbox>
            </Col>
          </Row>
        </Group>
        <!-- <Select defaultValue="default" class="history-dashboard-select">
          <Option key="select-section-default" value="default">{{$t("dashboard.history.default")}}</Option>
          <Option
            v-for="section in sections"
            :key="`select-section-${section.id}`"
            :value="section.id"
          >{{section.title}}</Option>
        </Select>-->
      </div>
    </div>
    <LineChart :chartData="lineChartData" :options="lineChartOptions" :width="300" :height="300" />
  </div>
</template>

<script>
import { Row, Col, Checkbox } from "ant-design-vue";
import LineChart from "./LineChart";

// const { Option } = Select;
const { Group } = Checkbox;

export default {
  name: "HistoryDashboard",
  components: {
    // Option,
    LineChart,
    Row,
    Col,
    Group,
    Checkbox
    // Select
  },
  props: {
    sections: {
      type: Array,
      default: () => {
        return [];
      }
    }
    // projects: {
    //   type: Array,
    //   default: () => {
    //     return [];
    //   }
    // }
  },
  methods: {
    onChange(value) {
      console.log(value);
    }
  },
  data: () => {
    return {
      lineChartData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [
          {
            data: [5, 4, 3, 2, 5],
            borderColor: "rgba(54, 162, 235, 0.2)",
            fill: false
          }
        ]
      },
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
      }
    };
  }
};
</script>

<style scoped lang="scss">
@media screen and(max-width: $phone-width) {
  // .history-dashboard-description-left,
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

  // .history-dashboard-description-left {
  //   display: flex;
  //   align-items: center;
  // }

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

