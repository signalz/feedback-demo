<template>
  <div tabindex="0" @keydown.esc="handleEsc" class="feedback-page-wrapper">
    <Menu :projects="projects" :selectedProject="project" @selectProject="handleSelectProject" :eventName="eventName" />
    <Loading isSpin v-if="isLoading" />
    <div class="feedback-page-content">
      <div class="feedback-page-content-left" v-if="showOverview">
        <div class="feedback-page-content-left-header">
          <div>FEEDBACK</div>
          <div style="display: flex">
            <Button type="primary" @click="onClickNew" v-if="project.id !== allProjectsId">New</Button>
            <Button
              type="primary"
              class="feedback-page-content-left-header-button"
              @click="onClick"
            >Dashboard</Button>
          </div>
        </div>
        <OverviewTable :sections="sections" v-if="project.id === allProjectsId" />
        <div
          v-if="project.id !== allProjectsId && feedbackState !== feedbackStates.NO_FEEDBACK"
          class="project-feedback"
        >
          <ProjectFeedback
            :sections="selectedSections"
            :ratings="ratings"
            @ratechange="handleRateChange"
            @submitProject="handleSubmitProject"
            :state="feedbackState"
            :event="eventName"
            :review="review"
          />
        </div>
        <div
          v-if="project.id !== allProjectsId && feedbackState === feedbackStates.NO_FEEDBACK"
          class="project-feedback"
        >
          <div style="color: #000">Click New button to review this project</div>
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
        <Dashboard
          :sections="sections"
          :pieChartData="pieChartData"
          :lineChartData="lineChartData"
          @changeOverviewSection="changeOverviewSection"
          @changeHistorySection="changeHistorySection"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { message, Button } from "ant-design-vue";
import moment from "moment";

import Loading from "./Loading";
import Menu from "./Menu";
import Dashboard from "./Dashboard";
import OverviewTable from "./OverviewTable";
import ProjectFeedback from "./ProjectFeedback";
// import SubmittedProject from "./SubmittedProject";

import { END_POINT, DASHBOARD_LABELS_LIST } from "../config";
import {
  FEEDBACK_STATUS,
  RATINGS,
  USER_ID,
  ALL_PROJECTS,
  FEEDBACK_STATE
} from "../config";

export default {
  name: "FeedbackPage",
  mounted() {
    window.addEventListener("resize", this.myEventHandler);
    window.dispatchEvent(new Event("resize"));
    Promise.all([
      fetch(`${END_POINT}/api/projects`).then(res => res.json()),
      fetch(`${END_POINT}/api/sections`).then(res => res.json()),
      fetch(`${END_POINT}/api/surveys`).then(res => res.json()),
      fetch(`${END_POINT}/api/dashboard/projects/summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => res.json()),
      fetch(`${END_POINT}/api/dashboard/projects/history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => res.json())
    ])
      .then(([projects, sections, surveys, pieChartData, lineChartData]) => {
        if (sections && sections.length > 0) {
          this.sections = sections;
        }

        if (pieChartData) {
          this.pieChartData = DASHBOARD_LABELS_LIST.map(
            item => pieChartData[item]
          );
        }

        if (lineChartData) {
          this.lineChartData = [
            lineChartData.sort((a, b) => {
              return moment(a.date, "YYYY-MM-DD") < moment(b.date, "YYYY-MM-DD")
                ? -1
                : 1;
            })
          ];
        }

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
    OverviewTable,
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
      lineChartData: [],
      surveys: [],
      survey: {},
      feedbackStates: FEEDBACK_STATE,
      feedbackState: FEEDBACK_STATE.NO_FEEDBACK,
      historySections: ["overview"],
      overviewSection: "default",
      eventName: "",
      review: ""
    };
  },
  methods: {
    myEventHandler(e) {
      if (e.target.innerWidth <= 768) {
        if (this.showOverview) {
          this.showDashboard = false;
        }
        // this.showOverview = true;
      } else {
        this.showDashboard = true;
        this.showOverview = true;
      }
    },

    onClick() {
      this.showDashboard = !this.showDashboard;
      this.showOverview = !this.showOverview;
    },

    onClickNew() {
      this.feedbackState = FEEDBACK_STATE.NEW_FEEDBACK;
      this.selectedSections = this.survey.sections.map(section => {
        return {
          ...section,
          title: this.sections.find(item => item.id === section.sectionId).title
        };
      });
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
          Promise.all(
            [
              fetch(
                `${END_POINT}/api/surveys/${surveyId}/project/${selectedProject.id}`
              ).then(res => res.json()),
              fetch(
                `${END_POINT}/api/feedbacks/survey/${surveyId}/project/${selectedProject.id}/user/${USER_ID}`
              ).then(res => res.json()),
              fetch(`${END_POINT}/api/dashboard/projects/summary`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  sectionId:
                    this.overviewSection === "default"
                      ? null
                      : this.overviewSection,
                  projectId:
                    this.project.id === ALL_PROJECTS ? null : this.project.id
                })
              }).then(res => res.json())
            ].concat(
              this.historySections.map(section =>
                fetch(`${END_POINT}/api/dashboard/projects/history`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    sectionId: section === "overview" ? null : section,
                    projectId:
                      this.project.id === ALL_PROJECTS ? null : this.project.id
                  })
                }).then(res => res.json())
              )
            )
          )
            .then(values => {
              const [survey, feedback, pieChartData, ...lineChartData] = values;
              this.pieChartData = DASHBOARD_LABELS_LIST.map(
                item => pieChartData[item]
              );
              this.lineChartData = lineChartData.map(val =>
                val.sort((a, b) => {
                  return moment(a.date, "YYYY-MM-DD") <
                    moment(b.date, "YYYY-MM-DD")
                    ? -1
                    : 1;
                })
              );
              this.survey = { ...survey, id: surveyId };
              this.selectedSections = survey.sections.map(section => {
                return {
                  ...section,
                  title: this.sections.find(
                    item => item.id === section.sectionId
                  ).title
                };
              });
              if (feedback) {
                this.feedbackState = FEEDBACK_STATE.LAST_FEEDBACK;
                this.review = feedback.review;

                this.selectedSections = this.selectedSections.map(section => {
                  return {
                    ...section,
                    questions: section.questions.map(q => {
                      return {
                        ...q,
                        rating: feedback.ratings
                          .find(item => item.sectionId === section.sectionId)
                          .questions.find(
                            item => item.questionId === q.questionId
                          ).rating
                      };
                    })
                  };
                });
              }
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

    handleSubmitProject({ event, review }) {
      const { project, selectedSections } = this;
      this.isLoading = true;
      const request = {
        userId: USER_ID,
        surveyId: this.survey.id,
        projectId: project.id,
        review,
        event,
        ratings: selectedSections.map(s => ({
          sectionId: s.sectionId,
          questions: s.questions.map(q => ({
            questionId: q.questionId,
            rating: q.rating
          }))
        }))
      };
      fetch(`${END_POINT}/api/feedbacks/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
      })
        .then(res => {
          this.isLoading = false;
          this.eventName = event;
          this.review = review;
          if (res.ok) {
            this.feedbackState = FEEDBACK_STATE.LAST_FEEDBACK;
            this.message.success("Thanks for your review");
          } else {
            this.message.error(res.statusText);
          }
        })
        .catch(e => {
          this.isLoading = false;
          this.message.error(e);
        });
    },

    changeOverviewSection({ sectionId }) {
      this.isLoading = true;
      this.overviewSection = sectionId;
      fetch(`${END_POINT}/api/dashboard/projects/summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sectionId: sectionId === "default" ? null : sectionId,
          projectId: this.project.id === ALL_PROJECTS ? null : this.project.id
        })
      })
        .then(res => res.json())
        .then(data => {
          this.pieChartData = DASHBOARD_LABELS_LIST.map(item => data[item]);
          this.isLoading = false;
        })
        .catch(e => {
          this.isLoading = false;
          this.message.error(e);
        });
    },

    changeHistorySection({ sections }) {
      this.isLoading = true;
      this.historySections = sections;
      Promise.all(
        sections.map(section =>
          fetch(`${END_POINT}/api/dashboard/projects/history`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              sectionId: section === "overview" ? null : section,
              projectId:
                this.project.id === ALL_PROJECTS ? null : this.project.id
            })
          }).then(res => res.json())
        )
      )
        .then(values => {
          if (values) {
            this.lineChartData = values.map(val =>
              val.sort((a, b) => {
                return moment(a.date, "YYYY-MM-DD") <
                  moment(b.date, "YYYY-MM-DD")
                  ? -1
                  : 1;
              })
            );
          }
          this.isLoading = false;
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
          margin-left: 10px;
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
