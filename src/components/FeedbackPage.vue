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
            <div class="feedback-page-content-left-header-text">
              {{ $t("feedback.feedback") }}
            </div>
            <Button
              v-if="project.id !== defaultValue"
              type="primary"
              class="feedback-page-content-left-header-new"
              @click="onClickNew"
              >{{ $t("feedback.new") }}</Button
            >
          </div>
          <div class="feedback-page-content-left-section">
            <OverviewTable
              :sections="sections"
              v-if="project.id === defaultValue"
            />
            <ProjectFeedback
              v-if="
                project.id !== defaultValue &&
                  feedbackState !== feedbackStates.NO_FEEDBACK
              "
              :sections="surveySections"
              :ratings="ratings"
              @ratechange="handleRateChange"
              @submitProject="handleSubmitProject"
              @cancelProject="handleCancelProject"
              :state="feedbackState"
              :event="eventName"
              :review="review"
            />
            <div
              class="feedback-page-content-new"
              v-if="
                project.id !== defaultValue &&
                  feedbackState === feedbackStates.NO_FEEDBACK
              "
            >
              {{ $t("feedback.new-feedback") }}
            </div>
          </div>
        </div>
        <div class="feedback-page-content-right">
          <div class="feedback-page-content-right-header">
            <div class="feedback-page-content-right-header-text">
              {{ $t("feedback.dashboard") }}
            </div>
          </div>
          <Dashboard
            :key="key"
            :sections="sections"
            :overviewData="overviewData"
            :historyData="historyData"
            @changeOverviewSection="changeOverviewSection"
            @changeHistorySection="changeHistorySection"
          />
        </div>
      </div>
    </mq-layout>
    <mq-layout
      :mq="[screenBreakpoints.xxs, screenBreakpoints.xs, screenBreakpoints.sm]"
    >
      <div class="feedback-page-content">
        <div class="feedback-page-content-left" v-if="showOverview">
          <div class="feedback-page-content-left-header">
            <div class="feedback-page-content-left-header-text">
              {{ $t("feedback.feedback") }}
            </div>
            <Button
              v-if="project.id !== defaultValue"
              type="primary"
              class="feedback-page-content-left-header-new"
              @click="onClickNew"
              >{{ $t("feedback.new") }}</Button
            >
            <Button
              type="primary"
              class="feedback-page-content-left-header-dashboard"
              @click="onClickChangeSection"
              >{{ $t("feedback.dashboard") }}</Button
            >
          </div>
          <div class="feedback-page-content-left-section">
            <OverviewTable
              :sections="sections"
              v-if="project.id === defaultValue"
            />
            <ProjectFeedback
              v-if="
                project.id !== defaultValue &&
                  feedbackState !== feedbackStates.NO_FEEDBACK
              "
              :sections="surveySections"
              :ratings="ratings"
              @ratechange="handleRateChange"
              @submitProject="handleSubmitProject"
              @cancelProject="handleCancelProject"
              :state="feedbackState"
              :event="eventName"
              :review="review"
            />
            <div
              class="feedback-page-content-new"
              v-if="
                project.id !== defaultValue &&
                  feedbackState === feedbackStates.NO_FEEDBACK
              "
            >
              {{ $t("feedback.new-feedback") }}
            </div>
          </div>
        </div>
        <div class="feedback-page-content-right" v-if="!showOverview">
          <div class="feedback-page-content-right-header">
            <div class="feedback-page-content-right-header-text">
              {{ $t("feedback.dashboard") }}
            </div>
            <Button
              type="primary"
              class="feedback-page-content-right-header-feedback"
              @click="onClickChangeSection"
              >{{ $t("feedback.feedback") }}</Button
            >
          </div>
          <Dashboard
            :sections="sections"
            :overviewData="overviewData"
            :historyData="historyData"
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
  SCREEN_BREAK_POINTS_DEFINITION,
  RATINGS,
  FEEDBACK_STATE
} from "../config";

const DATE_FORMAT = "YYYY-MM-DD";

export default {
  name: "FeedbackPage",
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
        name: DEFAULT
      },
      screenBreakpoints: SCREEN_BREAK_POINTS_DEFINITION,
      defaultValue: DEFAULT,
      sections: [],
      ratings: [],
      surveys: [],
      survey: {},
      message,
      isLoading: true,
      showOverview: true,
      overviewData: [],
      historyData: [],
      surveySections: [],
      feedbackStates: FEEDBACK_STATE,
      feedbackState: FEEDBACK_STATE.NO_FEEDBACK,
      key: Math.random(),
      eventName: "",
      review: "",
      feedback: {}
    };
  },
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
      .then(([projects, sections, surveys, overviewData, historyData]) => {
        if (sections && sections.length > 0) {
          this.sections = sections;
        }

        this.setOverviewData(overviewData);

        if (historyData && historyData.length > 0) {
          this.setHistoryData([historyData], [{ title: DEFAULT }]);
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
      .then(() => this.getOverviewTableData())
      .catch(e => {
        this.isLoading = false;
        this.message.error(e);
      });
  },
  methods: {
    onClickChangeSection() {
      this.showOverview = !this.showOverview;
    },

    onClickNew() {
      this.feedbackState = FEEDBACK_STATE.NEW_FEEDBACK;
      this.surveySections = this.survey.sections.map(section => {
        return {
          ...section,
          title: this.sections.find(item => item.id === section.id).title
        };
      });
    },

    setOverviewData(overviewData) {
      if (overviewData) {
        this.overviewData = DASHBOARD_LABELS_LIST.map(
          item => overviewData[item]
        );
      }
    },

    setHistoryData(historyData, sections) {
      if (historyData && historyData.length > 0) {
        this.historyData = sections.map((section, idx) => ({
          title: section.title,
          data: historyData[idx].sort((a, b) => {
            return moment(a.date, DATE_FORMAT) < moment(b.date, DATE_FORMAT)
              ? -1
              : 1;
          })
        }));
      }
    },

    getOverviewTableData() {
      if (this.sections.length > 0) {
        this.isLoading = true;
        Promise.all(
          this.sections.map(section =>
            request(`${END_POINT}/api/dashboard/projects/summary`, {
              method: "POST",
              body: JSON.stringify({
                sectionId: section.id
              })
            })
          )
        )
          .then(values => {
            this.sections = this.sections.map((section, idx) => ({
              ...section,
              ...values[idx]
            }));
            this.isLoading = false;
          })
          .catch(e => {
            throw e;
          });
      }
    },

    getRating({ ratings, section, question }) {
      let rating;
      const ratingSection = ratings.find(item => item.sectionId === section.id);
      if (ratingSection) {
        const { questions } = ratingSection;
        const ratingQuestion = questions.find(
          itemQ => itemQ.questionId === question.id
        );

        if (ratingQuestion) {
          rating = ratingQuestion.rating;
        }
      }
      return rating;
    },

    handleSelectProject({ id }) {
      if (this.project.id === id) {
        return;
      }
      this.isLoading = true;
      if (id === DEFAULT) {
        this.project = {
          id: DEFAULT,
          name: DEFAULT
        };

        Promise.all([
          request(`${END_POINT}/api/dashboard/projects/summary`, {
            method: "POST"
          }),
          request(`${END_POINT}/api/dashboard/projects/history`, {
            method: "POST"
          })
        ])
          .then(([overviewData, historyData]) => {
            this.setOverviewData(overviewData);
            this.setHistoryData([historyData], [{ title: DEFAULT }]);
            // trigger re-mount overview dashboard
            this.key = Math.random();
            this.isLoading = false;
          })
          .then(() => this.getOverviewTableData())
          .catch(e => {
            this.isLoading = false;
            this.message.error(e);
          });
      } else {
        const selectedProject = this.projects.find(p => p.id === id);
        this.project = {
          name: selectedProject.name,
          id: selectedProject.id
        };
        if (this.surveys.length > 0) {
          // temporary get survey for project
          const { surveyId } = selectedProject;
          Promise.all([
            request(`${END_POINT}/api/surveys/${surveyId}`),
            request(
              `${END_POINT}/api/feedbacks?surveyId=${surveyId}&projectId=${selectedProject.id}`
            ),
            request(`${END_POINT}/api/dashboard/projects/summary`, {
              method: "POST"
            }),
            request(`${END_POINT}/api/dashboard/projects/history`, {
              method: "POST"
            })
          ])
            .then(([survey, feedback, overviewData, historyData]) => {
              this.setOverviewData(overviewData);
              this.setHistoryData([historyData], [{ title: DEFAULT }]);

              this.survey = { ...survey, id: surveyId };

              this.surveySections = survey.sections.map(section => {
                return {
                  ...section,
                  title: this.sections.find(item => item.id === section.id)
                    .title
                };
              });
              // temp check feedback existed
              if (feedback.id) {
                this.feedback = feedback;
                this.feedbackState = FEEDBACK_STATE.LAST_FEEDBACK;
                this.review = feedback.review;
                this.eventName = feedback.event;

                this.surveySections = this.surveySections.map(section => {
                  return {
                    ...section,
                    questions: section.questions.map(q => {
                      return {
                        ...q,
                        // rating: feedback.ratings
                        //   .find(item => item.sectionId === section.id)
                        //   .questions.find(itemQ => itemQ.questionId === q.id)
                        //   .rating,
                        rating: this.getRating({
                          ratings: feedback.ratings,
                          section,
                          question: q
                        })
                      };
                    })
                  };
                });
              } else {
                this.feedbackState = FEEDBACK_STATE.NO_FEEDBACK;
                this.eventName = "";
                this.review = "";
              }
              // trigger re-mount overview dashboard
              this.key = Math.random();
              this.isLoading = false;
            })
            .catch(e => {
              console.log(e);
              this.isLoading = false;
              this.message.error(e);
            });
        } else {
          this.message.error("Cannot retrieve survey");
        }
      }
    },

    handleRateChange({ sectionId, questionId, rating }) {
      this.surveySections = this.surveySections.map(s => {
        if (s.id === sectionId) {
          return {
            ...s,
            questions: s.questions.map(q => {
              if (q.id === questionId) {
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
      const { project, surveySections } = this;
      this.isLoading = true;
      const requestBody = {
        surveyId: this.survey.id,
        projectId: project.id,
        review,
        event,
        ratings: surveySections.map(s => ({
          sectionId: s.id,
          questions: s.questions.map(q => ({
            questionId: q.id,
            rating: q.rating
          }))
        }))
      };

      request(`${END_POINT}/api/feedbacks`, {
        method: "POST",
        body: JSON.stringify(requestBody)
      })
        .then(() => {
          this.isLoading = false;
          this.eventName = event;
          this.review = review;
          this.feedbackState = FEEDBACK_STATE.LAST_FEEDBACK;
          this.message.success(this.$t("feedback.thanks"));
        })
        .catch(e => {
          this.isLoading = false;
          this.message.error(e);
        });
    },

    handleCancelProject() {
      if (this.feedback.id) {
        this.feedbackState = FEEDBACK_STATE.LAST_FEEDBACK;
        this.surveySections = this.surveySections.map(section => {
          return {
            ...section,
            questions: section.questions.map(q => {
              return {
                ...q,
                // rating: this.feedback.ratings
                //   .find(item => item.sectionId === section.id)
                //   .questions.find(itemQ => itemQ.questionId === q.id).rating,
                rating: this.getRating({
                  ratings: this.feedback.ratings,
                  section,
                  question: q
                })
              };
            })
          };
        });
      } else {
        this.feedbackState = FEEDBACK_STATE.NO_FEEDBACK;
      }
    },

    changeOverviewSection({ sectionId }) {
      this.isLoading = true;
      request(`${END_POINT}/api/dashboard/projects/summary`, {
        method: "POST",
        body: JSON.stringify({
          sectionId: sectionId === DEFAULT ? null : sectionId,
          projectId: this.project.id === DEFAULT ? null : this.project.id
        })
      })
        .then(data => {
          this.setOverviewData(data);
          this.isLoading = false;
        })
        .catch(e => {
          this.isLoading = false;
          this.message.error(e);
        });
    },

    changeHistorySection({ sections }) {
      this.isLoading = true;
      Promise.all(
        sections.map(section =>
          request(`${END_POINT}/api/dashboard/projects/history`, {
            method: "POST",
            body: JSON.stringify({
              sectionId: section.id === DEFAULT ? null : section.id,
              projectId: this.project.id === DEFAULT ? null : this.project.id
            })
          })
        )
      )
        .then(values => {
          this.setHistoryData(values, sections);
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
    padding-top: 59px;
    display: flex;
    position: relative;
    &::before {
      content: "";
      position: fixed;
      border: 2px solid $dark-blue-color;
      @media screen and (min-width: $desktop-width) {
        left: 300px;
        right: 0;
        top: 60px;
        bottom: 0;
      }
      @media screen and (max-width: $desktop-width) {
        left: 0;
        right: 0;
        top: 60px;
        bottom: 0;
      }
    }
    &:after {
      content: "";
      position: fixed;
      background: #16619c;
      top: 0;
      bottom: 0;
      right: calc((100% - 260px) / 2);
      @media screen and (min-width: $desktop-width) {
        width: 2px;
      }
      @media screen and (max-width: $desktop-width) {
        width: 0px;
      }
    }
    .feedback-page-content-left {
      width: 50%;
      height: 100%;
      margin: 0px 0px 0 10px;
      padding-top: 20px;
      padding-right: 10px;

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

      .feedback-page-content-left-section {
        color: rgba(0, 0, 0, 0.65);
      }
    }

    .feedback-page-content-right {
      width: 50%;
      height: 100%;
      min-height: 100%;
      margin: 0px 10px 0 10px;
      padding-top: 20px;

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
      padding-left: $side-menu-width;
    }
  }
}

.feedback-page-wrapper:focus {
  outline: none;
}
</style>
