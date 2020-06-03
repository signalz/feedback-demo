<template>
  <div>
    <div>
      <Collapse :defaultActiveKey="activeKey" >
        <Panel
          v-for="(project, idx) in projects"
          :key="project.id"
          :header="`Ratings for ${project.name}`"
        >
        <div>
          <span>Please select a project: </span>
          <Select :defaultValue="listSelectProjects[0].name"  @change="handleChangeProject(idx, $event)">
            <Option
              v-for="selectProject in listSelectProjects"
              :key="selectProject.id"
              :value="selectProject.id"
            >{{selectProject.name}}</Option>
          </Select>
        </div>
        </Panel>
      </Collapse>
      <Row>
        <Col v-bind:span="2">No</Col>
        <Col v-bind:span="16">Question</Col>
        <Col v-bind:span="6">Rating</Col>
      </Row>
      <span>Section</span>
      <span>Question</span>
      <span>Rating</span>
    </div>
    <FeedbackIcon v-for="rating in ratings" v-bind:key="rating.rate" v-bind:type="rating.icon" />
  </div>
</template>

<script>
// eslint-disable
import { Row, Col, Collapse, Select } from "ant-design-vue";
import FeedbackIcon from "./FeedbackIcon.vue";
import { RATINGS, PROJECTS } from "../config";

const { Panel } = Collapse;
const { Option } = Select;
const defaultProject = PROJECTS[0];

export default {
  name: "FeedbackPage",
  components: {
    FeedbackIcon,
    Row,
    Col,
    Collapse,
    Panel,
    Select,
    Option
  },
  data: () => {
    return {
      ratings: RATINGS,
      projects: [defaultProject],
      activeKey: [defaultProject.id],
      listSelectProjects: PROJECTS
    };
  },
  methods: {
    handleChangeProject(idx, val) {
      this.$set(this.projects, idx, this.listSelectProjects.find(prj => prj.id === val))
      this.$set(this.activeKey, 0, val)
      console.log(this.activeKey)
      // this.activeKey.push(val)
    }
  }
};
</script>

<style scoped>
</style>
