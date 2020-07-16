<template>
  <div>
    <Loading :isSpin="true" v-if="isLoading" class="menu-loading-wrapper" />
    <Table
      :columns="columnsHistoryTable"
      :row-key="record => record.id"
      :data-source="historyData"
      class="table-wrapper"
    >
      <a slot="projectName" slot-scope="text">{{ text }}</a>
      <span slot="createdBy" slot-scope="createdBy">
        <Tag color="geekblue">{{createdBy}}</Tag>
      </span>
      <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <div
          v-for="section in record.sections || []"
          :key="section.id"
          class="project-feedback-section"
        >
          <div class="project-feedback-section-header">{{ section.title }}</div>
          <div>
            <div v-for="(question, qIdx) in section.questions" :key="question.id">
              <QuestionRow :question="{ ...question, index: qIdx + 1 }" :ratings="ratings" />
            </div>
          </div>
        </div>
      </div>
    </Table>
  </div>
</template>
<script>
const columnsHistoryTable = [
  {
    title: "Project",
    dataIndex: "projectName",
    scopedSlots: { customRender: "projectName" },
    defaultSortOrder: "ascend",
    sorter: (a, b) => {
      return a.projectName.localeCompare(b.projectName);
    }
  },
  {
    title: "Event",
    dataIndex: "event",
    sorter: (a, b) => {
      return a.event.localeCompare(b.event);
    }
  },
  {
    title: "Created By",
    dataIndex: "createdBy",
    scopedSlots: { customRender: "createdBy" },
    sorter: (a, b) => {
      return a.createdBy.localeCompare(b.createdBy);
    }
  },
  {
    title: "Created Time",
    dataIndex: "createdTime",
    sorter: (a, b) => {
      return a.createdTime.localeCompare(b.createdTime);
    }
  },
  {
    title: "Comment",
    dataIndex: "review",
    sorter: (a, b) => {
      return a.review.localeCompare(b.review);
    }
  }
];

import { Table, Tag, message } from "ant-design-vue";
import QuestionRow from "./QuestionRow";
import Loading from "./Loading";
import { request } from "../api";
import { END_POINT, RATINGS } from "../config";
import moment from "moment";
export default {
  components: {
    Table,
    QuestionRow,
    Loading,
    Tag
  },
  data() {
    return {
      columnsHistoryTable,
      isLoading: true,
      deleteModalVisible: false,
      changePassModalVisible: false,
      detailModalVisible: false,
      typeDetailModal: "",
      selectedUser: "",
      selectedID: "",
      roleModel: "USER",
      form: {},
      formChangePass: {},
      ratings: [],
      users: [],
      historyData: [],
      message
    };
  },
  mounted() {
    this.ratings = RATINGS;
    Promise.all([
      request(`${END_POINT}/api/feedbacks/history?`, {
        method: "GET"
      })
    ])
      .then(([historyData]) => {
        if (historyData && historyData.length > 0) {
          historyData.forEach(element => {
            element.createdTime = moment(element.createdAt).format(
              "YYYY-MM-DD"
            );
            element.createdBy =
              element.user.firstName + " " + element.user.lastName;
            element.projectName = element.project.name;
          });
          this.historyData = historyData;
        }
        this.isLoading = false;
      })
      .catch(e => {
        this.isLoading = false;
        this.message.error(e);
      });
  }
};
</script>
<style scoped lang="scss">
.project-feedback-section-header {
  font-size: 22px;
  color: #22282d;
}
</style>
