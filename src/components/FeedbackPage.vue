<template>
  <div>
    <Menu :projects="projects" :selectedProject="project" @selectProject="handleSelectProject" />
    <Loading isSpin v-if="isLoading" />
    <div class="no-project" v-if="!project">
      <NoProjectSelected />
    </div>
    <div v-if="project" class="project-feedback">
      <ProjectFeedback :sections="sections" :ratings="ratings" />
    </div>
  </div>
  <!-- <div>
    <Menu />
    <Modal v-model="visible" title="Information" class="modal">
      <template slot="footer">
        <Button @click="handleOk" type="primary">OK</Button>
      </template>
      <p class="modal-info">Thank you for your evaluation</p>
    </Modal>
    <div class="panels-wrapper">
      <div class="collapse-panel" v-for="(project, idx) in projects" :key="`${project.id}-${idx}`">
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
              >{{selectProject.projectName}}</Option>
            </Select>
          </div>
        </div>
        <div class="collapse-body" v-if="!project.isCollapsed">
          <Collapse v-model="activeKeys">
            <Panel
              v-for="section in project.sections"
              :key="`${section.id}`"
              :header="section.title"
            >
              <div>
                <QuestionRow
                  v-for="(question, qIdx) in section.questions"
                  :key="`${question._id}`"
                  :ratings="ratings"
                  :section="section.id"
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
  </div>-->
</template>

<script>
import { message } from "ant-design-vue";

import Loading from "./Loading";
import Menu from "./Menu";
import NoProjectSelected from "./NoProjectSelected";
import ProjectFeedback from "./ProjectFeedback";

import { END_POINT } from "../config";
// import { Button, Collapse, Icon, Select, Modal } from "ant-design-vue";

// import QuestionRow from "./QuestionRow.vue";
import { QUESTIONS, RATINGS, SECTIONS } from "../config";

// const { Panel } = Collapse;
// const { Option } = Select;

// const defaultProject = {
//   ...PROJECTS[0],
//   isCollapsed: false,
//   questions: QUESTIONS,
//   sections: SECTIONS
// };

export default {
  name: "FeedbackPage",
  mounted() {
    Promise.all([
      fetch(`${END_POINT}/api/projects`).then(res => res.json())
      // fetch(`${END_POINT}/api/sections`).then(res => res.json())
    ])
      .then(([projects, sections]) => {
        if (sections && sections.length > 0) {
          this.sections = sections;
        }
        this.sections = SECTIONS;
        this.sections = this.sections.map(section => {
          return {
            ...section,
            questions: QUESTIONS[section.key]
          };
        });
        this.ratings = RATINGS;
        if (projects && projects.length > 0) {
          this.projects = projects;
        }
        this.isLoading = false;
      })
      .catch(e => {
        this.isLoading = false;
        this.message.error(e);
      });
  },
  components: {
    Loading,
    Menu,
    NoProjectSelected,
    ProjectFeedback
  },
  mounted() {
    Promise.all([
      fetch(`${END_POINT}projects`).then(res => res.json()),
      fetch(`${END_POINT}sections`).then(res => res.json())
    ])
      .then(([projects, sections]) => {
        if (sections && sections.length > 0) {
          this.sections = sections;
          this.activeKeys = sections.map(section => section.id);
        }

        if (projects && projects.length > 0) {
          this.listSelectProjects = projects;
          this.projects = [
            {
              ...projects[0],
              isCollapsed: false,
              sections: sections.filter(section => {
                if (projects[0].sections.includes(section.id)) {
                  return { ...section };
                }
              })
            }
          ];
        }

        this.isLoading = false;
      })
      .catch(e => {
        this.isLoading = false;
        this.message.error(e);
      });
  },
  data: () => {
    return {
      sections: [],
      projects: [],
      ratings: [],
      project: undefined,
      message,
      isLoading: true
    };
  },
  methods: {
    handleSelectProject({ id }) {
      this.project = id;
    }
  }
};

// export default {
//   name: "FeedbackPage",
//   components: {
//     Button,
//     Collapse,
//     Icon,
//     Modal,
//     Menu,
//     Option,
//     Panel,
//     QuestionRow,
//     Select
//   },
//   data: () => {
//     return {
//       ratings: RATINGS,
//       listSelectProjects: PROJECTS,
//       projects: [defaultProject],
//       activeKeys: SECTIONS.map(section => `section-${section.key}`),
//       visible: false
//     };
//   },
//   methods: {
//     handleChangeProject(idx, val) {
//       this.$set(this.projects, idx, {
//         ...defaultProject,
//         ...this.listSelectProjects.find(prj => prj.id === val)
//       });
//     },

//     handleClickCollapse(idx) {
//       this.$set(this.projects, idx, {
//         ...this.projects[idx],
//         isCollapsed: !this.projects[idx].isCollapsed
//       });
//     },

//     handleRateChange({ questionId, projectIdx, ratingId, section }) {
//       this.projects[projectIdx] = {
//         ...this.projects[projectIdx],
//         questions: {
//           ...this.projects[projectIdx].questions,
//           [section]: this.projects[projectIdx].questions[section].map(q => {
//             if (q.id === questionId) {
//               return {
//                 ...q,
//                 ratingId
//               };
//             }

//             return q;
//           })
//         }
//       };
//       this.$forceUpdate();
//     },

//     onClickSubmit() {
//       this.visible = true;
//     },

//     addProject() {
//       this.projects = this.projects.concat(defaultProject);
//     },

//     handleOk() {
//       this.visible = false;
//     }
//   }
// };
</script>

<style scoped lang="scss">
.no-project {
  padding-top: 100px;
}

@media screen and (min-width: $desktop-width) {
  .project-feedback {
    padding-left: 320px !important;
  }
}

.project-feedback {
  padding-top: 100px;
  padding-left: 20px;
  color: #7a7e81;
  padding-right: 20px;
}

// .ant-modal-title {
//   font-weight: bold;
// }

// .modal-info {
//   font-size: 24px;
// }

// @media screen and(max-width: $phone-width) {
//   .panels-wrapper {
//     padding-top: 100px;

//     .collapse-panel {
//       .collapse-header {
//         .collapse-left-header {
//           span {
//             display: none;
//           }

//           .select-project {
//             margin-left: 10px;
//           }
//         }
//       }
//     }
//   }
// }

// @media screen and(min-width: $desktop-width) {
//   .panels-wrapper {
//     padding-top: 100px;
//   }
// }

// .panels-wrapper {
//   margin-left: 20px;
//   margin-right: 20px;
//   min-width: $min-width;
//   padding-top: 100px;

//   .collapse-panel {
//     color: rgba(0, 0, 0, 0.65);
//     margin-bottom: 20px;
//     min-width: $min-width;

//     .collapse-header {
//       background-color: #fafafa;
//       font-size: 20px;
//       height: 48px;
//       padding-left: 20px;
//       padding-right: 20px;
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       border: 1px solid #d9d9d9;
//       border-radius: 4px 4px 0 0;

//       .collapse-left-header {
//         display: flex;
//         align-items: center;

//         span {
//           margin-left: 10px;
//           margin-right: 10px;
//         }
//       }
//     }

//     .collapse-body {
//       border: 1px solid #d9d9d9;
//       border-top: none;
//       border-radius: 0 0 4px 4px;
//       padding: 20px;

//       .question-row {
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         margin-bottom: 20px;

//         .question-number {
//           width: 5%;
//         }

//         .question-text {
//           width: 75%;
//         }

//         .question-rating {
//           width: 20%;
//           display: flex;
//           justify-content: space-between;
//           font-size: 20px;
//         }
//       }
//     }
//   }

//   .buttons-bar {
//     display: flex;
//     justify-content: flex-end;
//     position: fixed;
//     bottom: 3%;
//     width: 95%;

//     button {
//       margin-right: 10px;
//     }
//   }
// }
</style>
