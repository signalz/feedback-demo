<template>
  <div>
    <Header />
    <div class="panels-wrapper">
      <div
        class="collapse-panel"
        v-for="(project, idx) in projects"
        :key="`list-projects-${project.id}`"
      >
        <div class="collapse-header">
          <div class="collapse-left-header">
            <Icon :type="project.isCollapsed ? 'right' : 'down'" @click="handleClickCollapse(idx)" />
            <span>Feedback on project:</span>
            <Select
              v-model="project.id"
              :defaultValue="listSelectProjects[0].id"
              @change="handleChangeProject(idx, $event)"
            >
              <Option
                v-for="selectProject in listSelectProjects"
                :key="`select-project-${selectProject.id}`"
                :value="selectProject.id"
              >{{selectProject.name}}</Option>
            </Select>
          </div>
          <div class="collapse-right-header">
            <span>Average point:</span>
          </div>
        </div>
        <div class="collapse-body" v-if="!project.isCollapsed">
          <Collapse v-model="activeKeys">
            <Panel
              v-for="section in sections"
              :key="`section-${section.key}`"
              :header="section.label"
            >
              <div>
                <div
                  v-for="(question, questionIdx) in questions[section.key]"
                  :key="`question-${section.key}-${question.id}`"
                  class="question-row"
                >
                  <div class="question-number">{{questionIdx + 1}}</div>
                  <div class="question-text">{{question.text}}</div>
                  <div class="question-rating">
                    <FeedbackIcon
                      v-for="rating in ratings"
                      :ratingId="rating.id"
                      :key="`rating-${rating.id}`"
                      :type="rating.icon"
                      :selected="isRatingSelected({ratingId: rating.id, questionId: question.id, projectIdx: idx})"
                      @ratechange="handleRateChange({questionId: question.id, projectIdx: idx}, $event)"
                    />
                  </div>
                </div>
                <!-- <div>Average section point:</div> -->
              </div>
            </Panel>
          </Collapse>
          <div class="project-point">Average point:</div>
        </div>
      </div>
      <div class="buttons-bar">
        <Button type="primary" @click="handleButtonClick('Saved')">Save as draft</Button>
        <Button type="primary" @click="handleButtonClick('Thank you for your evaluation')">Submit</Button>
        <Button type="primary" shape="circle" icon="plus" @click="addProject" />
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Collapse, Icon, Select } from "ant-design-vue";

import Header from "./Header.vue";
import FeedbackIcon from "./FeedbackIcon.vue";
import { PROJECTS, QUESTIONS, RATINGS, SECTIONS } from "../config";

const { Panel } = Collapse;
const { Option } = Select;

const defaultProject = {
  ...PROJECTS[0],
  isCollapsed: false,
  questions: []
};

export default {
  name: "FeedbackPage",
  components: {
    Button,
    Collapse,
    FeedbackIcon,
    Header,
    Icon,
    Option,
    Panel,
    Select
  },
  data: () => {
    return {
      ratings: RATINGS,
      sections: SECTIONS,
      listSelectProjects: PROJECTS,
      questions: QUESTIONS,
      projects: [defaultProject],
      activeKeys: SECTIONS.map(section => `section-${section.key}`),
    };
  },
  methods: {
    handleChangeProject(idx, val) {
      this.$set(this.projects, idx, {
        ...this.projects[idx],
        ...this.listSelectProjects.find(prj => prj.id === val)
      });
    },

    handleClickCollapse(idx) {
      this.$set(this.projects, idx, {
        ...this.projects[idx],
        isCollapsed: !this.projects[idx].isCollapsed
      });
    },

    isRatingSelected({ ratingId, questionId, projectIdx }) {
      const { questions } = this.projects[projectIdx];
      const answer = questions.find(q => q.questionId === questionId) || {};
      if (answer.ratingId === ratingId) {
        return true;
      }
      return false;
    },

    handleRateChange({ questionId, projectIdx }, { ratingId }) {
      const project = this.projects[projectIdx];
      const { questions } = project;
      const answer = questions.find(q => q.questionId === questionId);
      if (answer) {
        this.$set(
          this.projects[projectIdx],
          "questions",
          this.projects[projectIdx].questions.map(q => {
            if (q.questionId === questionId) {
              return {
                ...q,
                ratingId
              };
            } else {
              return q;
            }
          })
        );
      } else {
        this.$set(
          this.projects[projectIdx],
          "questions",
          this.projects[projectIdx].questions.concat({
            questionId,
            ratingId
          })
        );
      }
    },

    handleButtonClick(val) {
      alert(val);
    },

    addProject() {
      this.projects = this.projects.concat(defaultProject);
    }
  }
};
</script>

<style scoped>
.panels-wrapper{
  padding-top: 100px;
  margin-left: 20px;
  margin-right: 20px;
}

.collapse-panel {
  color: rgba(0, 0, 0, 0.65);
  min-width: 768px;
  margin-bottom: 20px;
}

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
}

.collapse-left-header {
  display: flex;
  align-items: center;
}

.collapse-left-header > span {
  margin-left: 10px;
  margin-right: 10px;
}

.collapse-right-header {
  font-size: 14px;
}

.collapse-body {
  border: 1px solid #d9d9d9;
  border-top: none;
  border-radius: 0 0 4px 4px;
  padding: 20px;
}

.question-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

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

.project-point {
  margin-top: 20px;
}

.buttons-bar {
  display: flex;
  justify-content: flex-end;
  position: fixed;
  bottom: 5%;
  width: 95%;
}

.buttons-bar > button {
  margin-left: 10px;
}
</style>
