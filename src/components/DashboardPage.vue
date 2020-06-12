<template>
  <div>
    <!-- <Header /> -->
    <div class="dashboards-wrapper">
      <Collapse v-model="activeKeys">
        <Panel header="Projects Overview" key="prj-overview">
          <div class="pie-description">
            <div class="pie-description-text">Projects overview by:</div>
            <Select defaultValue="default" class="pie-chart-select">
              <Option key="select-section-default" value="default">Overall</Option>
              <Option
                v-for="section in sections"
                :key="`select-section-${section.id}`"
                :value="section.id"
              >{{section.label}}</Option>
            </Select>
          </div>
          <PieChart
            :chartData="pieChartData"
            :width="300"
            :height="300"
            :options="pieChartOptions"
          />
        </Panel>
      </Collapse>
      <Collapse>
        <Panel header="Projects Comparison" key="prj-comparison">
          <div class="bar-description">
            <div class="bar-description-left">
              <div class="bar-description-text">Projects comparison by:</div>
              <Select defaultValue="default" class="bar-chart-select">
                <Option key="select-section-default" value="default">Overall</Option>
                <Option
                  v-for="section in sections"
                  :key="`select-section-${section.id}`"
                  :value="section.id"
                >{{section.label}}</Option>
              </Select>
            </div>
            <div class="bar-description-right">
              <div class="bar-description-text">Sort by:</div>
              <Select defaultValue="default" class="bar-chart-select">
                <Option key="select-compare-default" value="default">Name</Option>
                <Option key="select-compare-asc" value="asc">Point (ascending)</Option>
                <Option key="select-compare-desc" value="desc">Point (descending)</Option>
              </Select>
            </div>
          </div>
          <HorizontalBar
            :chartData="barChartData"
            :options="barChartOptions"
            :width="300"
            :height="300"
          />
        </Panel>
      </Collapse>
      <Collapse>
        <Panel header="Project History" key="prj-history">
          <div class="line-description">
            <div class="line-description-left">
              <div class="line-description-text">History of project:</div>
              <Select :defaultValue="projects[0].id" class="line-chart-select">
                <Option
                  v-for="project in projects"
                  :key="`select-prj-${project.id}`"
                  :value="project.id"
                >{{project.name}}</Option>
              </Select>
            </div>
            <div class="line-description-right">
              <div class="line-description-text">History of:</div>
              <Select defaultValue="default" class="bar-chart-select">
                <Option key="select-section-default" value="default">Overall</Option>
                <Option
                  v-for="section in sections"
                  :key="`select-section-${section.id}`"
                  :value="section.id"
                >{{section.label}}</Option>
              </Select>
            </div>
          </div>
          <LineChart
            :chartData="lineChartData"
            :options="lineChartOptions"
            :width="300"
            :height="300"
          />
        </Panel>
      </Collapse>
    </div>
  </div>
</template>

<script>
import { Collapse, Select } from "ant-design-vue";
import PieChart from "./PieChart";
import HorizontalBar from "./HorizontalBar";
import LineChart from "./LineChart";

// import Header from "./Header.vue";
import { SECTIONS, PROJECTS } from "../config";

const { Panel } = Collapse;
const { Option } = Select;

export default {
  name: "DashboardPage",
  components: {
    HorizontalBar,
    Collapse,
    // Header,
    LineChart,
    Panel,
    PieChart,
    Option,
    Select
  },
  data: () => {
    return {
      activeKeys: ["prj-overview"],
      pieChartData: {
        datasets: [
          {
            data: [1, 1, 1, 1],
            backgroundColor: [
              "#cd7f32 ",
              "#aaa9ad",
              "#faf369",
              "#e5e4e2"
            ],
            hoverBackgroundColor: [
              "#cd7f32 ",
              "#aaa9ad",
              "#faf369",
              "#e5e4e2"
            ],
            // borderColor: [
            //   "rgba(255,99,132,1)",
            //   "rgba(54, 162, 235, 1)",
            //   "rgba(255, 206, 86, 1)"
            // ],
            borderWidth: 1
          }
        ],
        labels: ["BRONZE", "SILVER", "GOLD", "PLATIN"]
      },
      pieChartOptions: {
        maintainAspectRatio: false
      },
      barChartData: {
        datasets: [
          {
            backgroundColor: [
              "#cd7f32 ",
              "#aaa9ad",
              "#faf369",
              "#e5e4e2"
            ],
            data: [2, 3, 4, 5]
          }
        ],
        labels: PROJECTS.map(prj => prj.name)
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
      },
      sections: SECTIONS,
      projects: PROJECTS,
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

<style scoped>
.dashboards-wrapper {
  padding-top: 100px;
  margin-left: 20px;
  margin-right: 20px;
}

.dashboards-wrapper > div {
  margin-bottom: 20px;
}

.pie-description {
  display: flex;
  align-items: center;
}

.pie-description-text {
  margin-right: 10px;
}

.pie-chart-select {
  width: 150px;
}

.bar-description {
  display: flex;
  justify-content: space-between;
}

.bar-description-left {
  display: flex;
  align-items: center;
}

.bar-description-text {
  margin-right: 10px;
}

.bar-description-right {
  display: flex;
  align-items: center;
}

.bar-chart-select {
  width: 150px;
}

.line-description {
  display: flex;
  justify-content: space-between;
}

.line-description-left {
  display: flex;
  align-items: center;
}

.line-description-text {
  margin-right: 10px;
}

.line-description-right {
  display: flex;
  align-items: center;
}

.line-chart-select {
  width: 150px;
}
</style>
