<template>
  <div class="feedback-page-wrapper">
    <Menu
      :projects="projects"
      :selectedProject="project"
      @selectProject="handleSelectProject"
      :eventName="eventName"
    />
    <Loading isSpin v-if="isLoading" />
    <mq-layout :mq="`${screenBreakpoints.md}+`">
      <div class="feedback-page-content">
        <div class="feedback-page-content-left">
          <div class="feedback-page-content-left-header">
            <div class="feedback-page-content-left-header-text">{{$t('feedback.feedback')}}</div>
            <Button
              v-if="project.id !== defaultValue"
              type="primary"
              class="feedback-page-content-left-header-new"
              @click="onClickNew"
            >{{$t('feedback.new')}}</Button>
          </div>
          <div class="feedback-page-content-left-section">
            <OverviewTable :sections="sections" v-if="project.id === defaultValue" />
            <ProjectFeedback
              v-if="project.id !== defaultValue && feedbackState !== feedbackStates.NO_FEEDBACK"
              :sections="selectedSections"
              :ratings="ratings"
              @ratechange="handleRateChange"
              @submitProject="handleSubmitProject"
              :state="feedbackState"
              :event="eventName"
              :review="review"
            />
            <div
              v-if="project.id !== defaultValue && feedbackState === feedbackStates.NO_FEEDBACK"
            >{{$t('feedback.new-feedback')}}</div>
          </div>
        </div>
        <div class="feedback-page-content-right">
          <div class="feedback-page-content-right-header">
            <div class="feedback-page-content-right-header-text">{{$t('feedback.dashboard')}}</div>
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
    </mq-layout>
    <mq-layout :mq="[screenBreakpoints.xxs, screenBreakpoints.xs, screenBreakpoints.sm]">
      <div class="feedback-page-content">
        <div class="feedback-page-content-left" v-if="showOverview">
          <div class="feedback-page-content-left-header">
            <div class="feedback-page-content-left-header-text">{{$t('feedback.feedback')}}</div>
            <Button
              v-if="project.id !== defaultValue"
              type="primary"
              class="feedback-page-content-left-header-new"
              @click="onClickNew"
            >{{$t('feedback.new')}}</Button>
            <Button
              type="primary"
              class="feedback-page-content-left-header-dashboard"
              @click="onClickChangeSection"
            >{{$t('feedback.dashboard')}}</Button>
          </div>
          <div class="feedback-page-content-left-section">
            <OverviewTable :sections="sections" v-if="project.id === defaultValue" />
            <ProjectFeedback
              v-if="project.id !== defaultValue && feedbackState !== feedbackStates.NO_FEEDBACK"
              :sections="selectedSections"
              :ratings="ratings"
              @ratechange="handleRateChange"
              @submitProject="handleSubmitProject"
              :state="feedbackState"
              :event="eventName"
              :review="review"
            />
            <div
              v-if="project.id !== defaultValue && feedbackState === feedbackStates.NO_FEEDBACK"
            >{{$t('feedback.new-feedback')}}</div>
          </div>
        </div>
        <div class="feedback-page-content-right" v-if="!showOverview">
          <div class="feedback-page-content-right-header">
            <div class="feedback-page-content-right-header-text">{{$t('feedback.dashboard')}}</div>
            <Button
              type="primary"
              class="feedback-page-content-right-header-feedback"
              @click="onClickChangeSection"
            >{{$t('feedback.feedback')}}</Button>
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
    </mq-layout>
  </div>
</template>

<script>
import { message, Button } from "ant-design-vue";
import moment from "moment";

import Dashboard from "./Dashboard";
import Loading from "./Loading";
import Menu from "./Menu";
import OverviewTable from "./OverviewTable";
import ProjectFeedback from "./ProjectFeedback";

import { request } from "../api";
import {
  END_POINT,
  DASHBOARD_LABELS_LIST,
  DEFAULT,
  SCREEN_BREAK_POINTS_DEFINITION
} from "../config";
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
    Promise.all([
      request(`${END_POINT}/api/projects`),
      request(`${END_POINT}/api/sections`),
      request(`${END_POINT}/api/surveys`),
      request(`${END_POINT}/api/dashboard/projects/summary`, {
        method: "POST"
      }),
      request(`${END_POINT}/api/dashboard/projects/history`, {
        method: "POST"
      })
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
  components: {
    Button,
    Dashboard,
    Loading,
    Menu,
    OverviewTable,
    ProjectFeedback
  },
  data: () => {
    return {
      projects: [],
      project: {
        id: DEFAULT,
        projectName: DEFAULT
      },
      screenBreakpoints: SCREEN_BREAK_POINTS_DEFINITION,
      defaultValue: DEFAULT,
      sections: [],
      ratings: [],
      message,
      isLoading: true,
      showOverview: true,

      selectedSections: [],
      feedbackStatus: FEEDBACK_STATUS,
      status: FEEDBACK_STATUS.DRAFT,
      allProjectsId: ALL_PROJECTS,
      showDashboard: false,
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
    onClickChangeSection() {
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
      if (id === DEFAULT) {
        this.project = {
          id: DEFAULT,
          projectName: DEFAULT
        };
      } else {
        selectedProject = this.projects.find(p => p.id === id);
        this.isLoading = true;
        this.project = {
          projectName: selectedProject.projectName,
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
.feedback-page-wrapper {
  .feedback-page-content {
    padding-top: $header-height;
    display: flex;

    .feedback-page-content-left {
      width: 50%;
      margin: 20px 10px auto 10px;

      .feedback-page-content-left-header {
        @include header-wrapper;

        .feedback-page-content-left-header-text {
          @include header-text;
        }

        .feedback-page-content-left-header-new {
          text-transform: uppercase;
          margin-right: 20px;
        }
      }
    }

    .feedback-page-content-right {
      width: 50%;
      margin: 20px 10px auto 10px;

      .feedback-page-content-right-header {
        @include header-wrapper;

        .feedback-page-content-right-header-text {
          @include header-text;
        }
      }
    }

    @media screen and (max-width: $tablet-width) {
      .feedback-page-content-left,
      .feedback-page-content-right {
        width: 100% !important;
      }
    }
  }

  @media screen and (min-width: $desktop-width) {
    .feedback-page-content {
      margin-left: $side-menu-width;
    }
  }
}

.feedback-page-wrapper:focus {
  outline: none;
}
</style>
