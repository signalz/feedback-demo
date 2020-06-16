<template>
  <div>
    <Modal v-model="visible" title="Information" class="modal">
      <template slot="footer">
        <Button @click="handleOk" type="primary">OK</Button>
      </template>
      <p class="modal-info">Thank you for your evaluation</p>
    </Modal>
    <div class="panels-wrapper">
      <div
        class="collapse-panel"
        v-for="(project, idx) in projects"
        :key="`list-projects-${project.id}-${idx}`"
      >
        <div class="collapse-header">
          <div class="collapse-left-header">
            <Icon :type="project.isCollapsed ? 'right' : 'down'" @click="handleClickCollapse(idx)" />
            <span>Feedback on project:</span>
            <Select
              v-model="project.id"
              :defaultValue="project.id"
              @change="handleChangeProject(idx, $event)"
              class="select-project"
            >
              <Option
                v-for="selectProject in listSelectProjects"
                :key="`select-project-${selectProject.id}`"
                :value="selectProject.id"
              >{{selectProject.name}}</Option>
            </Select>
          </div>
        </div>
        <div class="collapse-body" v-if="!project.isCollapsed">
          <Collapse v-model="activeKeys">
            <Panel
              v-for="section in project.sections"
              :key="`section-${section.key}`"
              :header="section.label"
            >
              <div>
                <QuestionRow
                  v-for="(question, qIdx) in project.questions[section.key]"
                  :key="`question-${section.key}-${question.id}`"
                  :ratings="ratings"
                  :section="section.key"
                  :question="{...question, index: qIdx + 1}"
                  :projectIdx="idx"
                  @ratechange="handleRateChange"
                />
              </div>
            </Panel>
          </Collapse>
        </div>
      </div>
      <div class="buttons-bar">
        <Button type="primary" @click="onClickSubmit" shape="circle" icon="save" />
        <Button type="primary" shape="circle" icon="plus" @click="addProject" />
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Collapse, Icon, Select, Modal } from "ant-design-vue";

import QuestionRow from "./QuestionRow.vue";
import { PROJECTS, QUESTIONS, RATINGS, SECTIONS } from "../config";

const { Panel } = Collapse;
const { Option } = Select;

const defaultProject = {
  ...PROJECTS[0],
  isCollapsed: false,
  questions: QUESTIONS,
  sections: SECTIONS
};

export default {
  name: "FeedbackPage",
  components: {
    Button,
    Collapse,
    Icon,
    Modal,
    Option,
    Panel,
    QuestionRow,
    Select
  },
  data: () => {
    return {
      ratings: RATINGS,
      listSelectProjects: PROJECTS,
      projects: [defaultProject],
      activeKeys: SECTIONS.map(section => `section-${section.key}`),
      visible: false
    };
  },
  methods: {
    handleChangeProject(idx, val) {
      this.$set(this.projects, idx, {
        ...defaultProject,
        ...this.listSelectProjects.find(prj => prj.id === val)
      });
    },

    handleClickCollapse(idx) {
      this.$set(this.projects, idx, {
        ...this.projects[idx],
        isCollapsed: !this.projects[idx].isCollapsed
      });
    },

    handleRateChange({ questionId, projectIdx, ratingId, section }) {
      this.projects[projectIdx] = {
        ...this.projects[projectIdx],
        questions: {
          ...this.projects[projectIdx].questions,
          [section]: this.projects[projectIdx].questions[section].map(q => {
            if (q.id === questionId) {
              return {
                ...q,
                ratingId
              };
            }

            return q;
          })
        }
      };
      this.$forceUpdate();
    },

    onClickSubmit() {
      this.visible = true;
    },

    addProject() {
      this.projects = this.projects.concat(defaultProject);
    },

    handleOk() {
      this.visible = false;
    }
  }
};
</script>

<style scoped lang="scss">
.ant-modal-title {
  font-weight: bold;
}

.modal-info {
  font-size: 24px;
}

@media screen and(max-width: $phone-width) {
  .panels-wrapper {
    padding-top: 30px;

    .collapse-panel {
      .collapse-header {
        .collapse-left-header {
          span {
            display: none;
          }

          .select-project {
            margin-left: 10px;
          }
        }
      }
    }
  }
}

@media screen and(min-width: $desktop-width) {
  .panels-wrapper {
    padding-top: 100px;
  }
}

.panels-wrapper {
  margin-left: 20px;
  margin-right: 20px;
  min-width: $min-width;

  .collapse-panel {
    color: rgba(0, 0, 0, 0.65);
    margin-bottom: 20px;
    min-width: $min-width;

    .collapse-header {
      background-color: #fafafa;
      font-size: 20px;
      height: 48px;
      padding-left: 20px;
      padding-right: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid #d9d9d9;
      border-radius: 4px 4px 0 0;

      .collapse-left-header {
        display: flex;
        align-items: center;

        span {
          margin-left: 10px;
          margin-right: 10px;
        }
      }
    }

    .collapse-body {
      border: 1px solid #d9d9d9;
      border-top: none;
      border-radius: 0 0 4px 4px;
      padding: 20px;

      .question-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        .question-number {
          width: 5%;
        }

        .question-text {
          width: 75%;
        }

        .question-rating {
          width: 20%;
          display: flex;
          justify-content: space-between;
          font-size: 20px;
        }
      }
    }
  }

  .buttons-bar {
    display: flex;
    justify-content: flex-end;
    position: fixed;
    bottom: 3%;
    width: 95%;

    button {
      margin-right: 10px;
    }
  }
}
</style>
