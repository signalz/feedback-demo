<template>
  <div tabindex="0" @keydown.esc="handleEsc" class="feedback-page-wrapper">
    <Menu :projects="projects" :selectedProject="project" @selectProject="handleSelectProject" />
    <Loading isSpin v-if="isLoading" />
    <div class="feedback-page-content">
      <div class="feedback-page-content-left" v-if="showOverview">
        <div class="feedback-page-content-left-header">
          <div>FEEDBACK</div>
          <Button
            type="primary"
            class="feedback-page-content-left-header-button"
            @click="onClick"
          >Dashboard</Button>
        </div>
        <Overview :sections="sections" v-if="project.id === allProjectsId" />
        <div
          v-if="project.id !== allProjectsId && status === feedbackStatus.DRAFT"
          class="project-feedback"
        >
          <ProjectFeedback
            :sections="selectedSections"
            :ratings="ratings"
            @ratechange="handleRateChange"
            @closeProject="handleCloseProject"
            @submitProject="handleSubmitProject"
          />
        </div>
      </div>
      <div class="feedback-page-content-right" v-if="showDashboard">
        <div class="feedback-page-content-right-header">
          <div>DASHBOARD</div>
          <Button
            type="primary"
            class="feedback-page-content-right-header-button"
            @click="onClick"
          >Feedback</Button>
        </div>
        <Dashboard :sections="sections" :pieChartData="pieChartData" />
      </div>
    </div>
    <!-- <div class="submitted-project" v-if="status === feedbackStatus.SUBMITTED">
      <SubmittedProject />
    </div>-->
    <!-- <div
      v-if="project.id !== allProjectsId && status === feedbackStatus.DRAFT"
      class="project-feedback"
    >
      <ProjectFeedback
        :sections="selectedSections"
        :ratings="ratings"
        @ratechange="handleRateChange"
        @closeProject="handleCloseProject"
        @submitProject="handleSubmitProject"
      />
    </div>-->
  </div>
</template>

<script>
import { message, Button } from "ant-design-vue";

import Loading from "./Loading";
import Menu from "./Menu";
import Dashboard from "./Dashboard";
import Overview from "./Overview";
import ProjectFeedback from "./ProjectFeedback";
// import SubmittedProject from "./SubmittedProject";

import { END_POINT } from "../config";
import { FEEDBACK_STATUS, RATINGS, USER_ID, ALL_PROJECTS } from "../config";

export default {
  name: "FeedbackPage",
  mounted() {
    window.addEventListener("resize", this.myEventHandler);
    window.dispatchEvent(new Event("resize"));
    Promise.all([
      fetch(`${END_POINT}/api/projects`).then(res => res.json()),
      fetch(`${END_POINT}/api/sections`).then(res => res.json()),
      fetch(`${END_POINT}/api/surveys`).then(res => res.json())
    ])
      .then(([projects, sections, surveys]) => {
        if (sections && sections.length > 0) {
          this.sections = sections;
        }

        this.pieChartData = [1, 2, 3, 5];
        this.ratings = RATINGS;
        if (projects && projects.length > 0) {
          this.projects = projects;
        }

        if (surveys && surveys.length > 0) {
          this.surveys = surveys;
        }

        this.isLoading = false;
      })
      .catch(e => {
        this.isLoading = false;
        this.message.error(e);
      });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.myEventHandler);
  },
  components: {
    Loading,
    Menu,
    Dashboard,
    Overview,
    ProjectFeedback,
    // SubmittedProject,
    Button
  },
  data: () => {
    return {
      sections: [],
      projects: [],
      ratings: [],
      project: {
        id: ALL_PROJECTS,
        name: ALL_PROJECTS
      },
      selectedSections: [],
      message,
      isLoading: true,
      feedbackStatus: FEEDBACK_STATUS,
      status: FEEDBACK_STATUS.DRAFT,
      allProjectsId: ALL_PROJECTS,
      showDashboard: false,
      showOverview: true,
      pieChartData: [],
      surveys: []
    };
  },
  methods: {
    myEventHandler(e) {
      if (e.target.innerWidth <= 768) {
        this.showDashboard = false;
      } else {
        this.showDashboard = true;
        this.showOverview = true;
      }
    },

    onClick() {
      this.showDashboard = !this.showDashboard;
      this.showOverview = !this.showOverview;
    },

    handleSelectProject({ id }) {
      let selectedProject;
      if (id === ALL_PROJECTS) {
        this.project = {
          id: ALL_PROJECTS,
          name: ALL_PROJECTS
        };
      } else {
        selectedProject = this.projects.find(p => p.id === id);
        this.isLoading = true;
        this.project = {
          name: selectedProject.projectName,
          id: selectedProject.id
        };
        if (this.surveys.length > 0) {
          const surveyId = this.surveys[0].id;
          fetch(
            `${END_POINT}/api/surveys/${surveyId}/project/${selectedProject.id}`
          )
            .then(res => res.json())
            .then(survey => {
              this.selectedSections = survey.sections.map(section => {
                return {
                  ...section,
                  title: this.sections.find(
                    item => item.id === section.sectionId
                  ).title
                };
              });
              this.isLoading = false;
            })
            .catch(e => {
              this.isLoading = false;
              this.message.error(e);
            });
        } else {
          this.message.error("Cannot retrieve survey");
        }
      }
    },

    handleRateChange({ sectionId, questionId, rating }) {
      this.selectedSections = this.selectedSections.map(s => {
        if (s.sectionId === sectionId) {
          return {
            ...s,
            questions: s.questions.map(q => {
              if (q.questionId === questionId) {
                return {
                  ...q,
                  rating
                };
              }
              return q;
            })
          };
        }
        return s;
      });
    },

    handleEsc() {
      this.project = undefined;
      this.status = FEEDBACK_STATUS.DRAFT;
    },

    handleCloseProject() {
      this.project = undefined;
      this.status = FEEDBACK_STATUS.DRAFT;
    },

    handleSubmitProject() {
      const { project, selectedSections } = this;
      this.isLoading = true;
      const requestSections = selectedSections.map(s => ({
        sectionId: s.id,
        questions: s.questions.map(q => ({
          questionId: q.id,
          rating: q.rating
        }))
      }));
      fetch(`${END_POINT}/api/ratings/${USER_ID}/${project}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestSections)
      })
        .then(res => {
          this.isLoading = false;
          if (res.ok) {
            this.status = FEEDBACK_STATUS.SUBMITTED;
          } else {
            this.message.error(res.statusText);
          }
        })
        .catch(e => {
          this.isLoading = false;
          this.message.error(e);
        });
    }
  }
};
</script>

<style scoped lang="scss">
.feedback-page-wrapper:focus {
  outline: none;
}

@media screen and (min-width: $desktop-width) {
  .feedback-page-wrapper {
    .feedback-page-content {
      margin-left: $side-menu-width;
    }
  }
}

@media screen and (max-width: $tablet-width) {
  .feedback-page-wrapper {
    .feedback-page-content {
      .feedback-page-content-left {
        width: 100% !important;

        .feedback-page-content-left-header-button {
          display: block !important;
        }
      }

      .feedback-page-content-right {
        width: 100% !important;

        .feedback-page-content-right-header-button {
          display: block !important;
        }
      }
    }
  }
}

.feedback-page-wrapper {
  .feedback-page-content {
    padding-top: $header-height;
    display: flex;

    .feedback-page-content-left {
      width: 50%;
      margin: 20px 10px auto 10px;
      overflow-y: auto;

      .feedback-page-content-left-header {
        display: flex;
        justify-content: space-between;
        color: #000;
        margin-bottom: 40px;

        .feedback-page-content-left-header-button {
          display: none;
        }
      }

      .feedback-page-content-left-header > div {
        font-size: 30px;
        font-weight: 500;
      }
    }

    .feedback-page-content-right {
      width: 50%;
      margin: 20px 10px auto 10px;
      overflow-y: auto;

      .feedback-page-content-right-header {
        display: flex;
        justify-content: space-between;
        color: #000;
        margin-bottom: 40px;

        .feedback-page-content-right-header-button {
          display: none;
        }
      }

      .feedback-page-content-right-header > div {
        font-size: 30px;
        font-weight: 500;
      }
    }
  }
}
</style>
