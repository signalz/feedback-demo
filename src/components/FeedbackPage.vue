<template>
  <div class="feedback-page-wrapper">
    <Menu
      :projects="projects"
      :selectedProject="project"
      :createdAt="projectData.createdAt"
      @selectProject="handleSelectProject"
      :eventName="eventName"
      :state="feedbackState"
    />
    <Loading isSpin v-if="isLoading" />
    <FeedbackHistoryModal
      :feedbacks="feedbacksHistory"
      :isVisible="isFeedbacksHistoryVisible"
      @close="isFeedbacksHistoryVisible = false"
      @viewDetail="viewDetailFeedback"
    />
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
            <Button
              v-if="project.id !== defaultValue"
              type="primary"
              class="feedback-page-content-left-header-new"
              @click="onClickHistory"
              >{{ $t("feedback.history") }}</Button
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
              :ratings="ratings"
              :projectData="projectData"
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
            <div>
              <Button
                v-if="project.id !== defaultValue"
                type="primary"
                class="feedback-page-content-left-header-new"
                @click="onClickNew"
                >{{ $t("feedback.new") }}</Button
              >
              <Button
                v-if="project.id !== defaultValue"
                type="primary"
                class="feedback-page-content-left-header-new"
                @click="onClickHistory"
                >{{ $t("feedback.history") }}</Button
              >
              <Button
                type="primary"
                class="feedback-page-content-left-header-dashboard"
                @click="onClickChangeSection"
                >{{ $t("feedback.dashboard") }}</Button
              >
            </div>
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
              :ratings="ratings"
              :projectData="projectData"
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
import FeedbackHistoryModal from "./FeedbackHistoryModal";
import Loading from "./Loading";
import Menu from "./Menu";
import OverviewTable from "./OverviewTable";
import ProjectFeedback from "./ProjectFeedback";

import { request } from "../api";
import {
  END_POINT,
  DASHBOARD_LABELS_LIST,
  DEFAULT,
  FEEDBACK_STATE,
  RATINGS,
  SCREEN_BREAK_POINTS_DEFINITION
} from "../config";
import { handleError } from "../utils";

const DATE_FORMAT = "YYYY-MM-DD";

export default {
  name: "FeedbackPage",
  components: {
    Button,
    Dashboard,
    FeedbackHistoryModal,
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
      columnsHistoryTable: [],
      screenBreakpoints: SCREEN_BREAK_POINTS_DEFINITION,
      defaultValue: DEFAULT,
      sections: [],
      ratings: RATINGS,
      message,
      isLoading: true,
      showOverview: true,
      overviewData: [],
      historyData: [],
      feedbackStates: FEEDBACK_STATE,
      feedbackState: FEEDBACK_STATE.NO_FEEDBACK,
      key: Math.random(),
      eventName: "",
      review: "",
      feedback: {},
      // keep dashboard selection
      overviewSection: DEFAULT,
      historySections: [{ title: DEFAULT }],
      projectData: {},
      isFeedbacksHistoryVisible: false,
      feedbacksHistory: []
    };
  },
  mounted() {
    Promise.all([
      request(`${END_POINT}/api/projects`),
      request(`${END_POINT}/api/sections`),
      request(`${END_POINT}/api/dashboard/projects/summary`, {
        method: "POST"
      }),
      request(`${END_POINT}/api/dashboard/projects/history`, {
        method: "POST"
      })
    ])
      .then(([projects, sections, overviewData, historyData]) => {
        if (sections && sections.length > 0) {
          this.sections = sections;
        }

        this.setOverviewData(overviewData);

        this.setHistoryData([historyData], [{ title: DEFAULT }]);

        if (projects && projects.length > 0) {
          this.projects = projects;
        }

        this.isLoading = false;
      })
      .then(() => this.getOverviewTableData())
      .catch(e => {
        this.isLoading = false;
        handleError(e, this.$router, this.$t("expired"));
      });
  },
  methods: {
    viewDetailFeedback({ feedback }) {
      this.projectData = feedback;
      this.eventName = feedback.event;
      this.review = feedback.review;
      this.isFeedbacksHistoryVisible = false;
      this.feedbackState = FEEDBACK_STATE.LAST_FEEDBACK;
    },

    onClickHistory() {
      this.isLoading = true;
      request(`${END_POINT}/api/feedbacks/history?projectId=${this.project.id}`)
        .then(data => {
          if (data && data.length > 0) {
            this.feedbacksHistory = data.map(feedback => ({
              ...feedback,
              createdDate: moment(feedback.createdAt).format(DATE_FORMAT)
            }));
          }
          this.isLoading = false;
          this.isFeedbacksHistoryVisible = true;
        })
        .catch(e => {
          this.isLoading = false;
          handleError(e, this.$router, this.$t("expired"));
        });
    },

    onClickChangeSection() {
      this.showOverview = !this.showOverview;
    },

    onClickNew() {
      this.feedbackState = FEEDBACK_STATE.NEW_FEEDBACK;
      if (this.project.survey && this.project.survey.id) {
        const surveyId = this.project.survey.id;
        this.isLoading = true;

        request(`${END_POINT}/api/surveys/${surveyId}`)
          .then(survey => {
            this.isLoading = false;
            this.projectData = survey;
          })
          .catch(e => {
            this.isLoading = false;
            this.message.error(e);
          });
      } else {
        this.message.error("Cannot retrieve survey");
      }
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
                sectionTitle: section.title
              })
            })
          )
        )
          .then(values => {
            this.sections = this.sections.map((section, idx) => ({
              title: section.title,
              ...values[idx]
            }));
            this.isLoading = false;
          })
          .catch(e => {
            throw e;
          });
      }
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
        this.projectData = {};

        Promise.all([
          request(`${END_POINT}/api/dashboard/projects/summary`, {
            method: "POST"
          }),
          request(`${END_POINT}/api/dashboard/projects/history`, {
            method: "POST"
          }),
          request(`${END_POINT}/api/sections`)
        ])
          .then(([overviewData, historyData, sections]) => {
            this.setOverviewData(overviewData);
            this.setHistoryData([historyData], [{ title: DEFAULT }]);
            if (sections && sections.length > 0) {
              this.sections = sections;
            }
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
        let managerName = "";
        if (selectedProject.manager) {
          managerName =
            selectedProject.manager.firstName +
            " " +
            selectedProject.manager.lastName;
        }
        this.project = {
          ...selectedProject,
          manager: managerName
        };
        Promise.all([
          request(`${END_POINT}/api/feedbacks?projectId=${selectedProject.id}`),
          request(`${END_POINT}/api/dashboard/projects/summary`, {
            method: "POST",
            body: JSON.stringify({ projectId: id })
          }),
          request(`${END_POINT}/api/dashboard/projects/history`, {
            method: "POST",
            body: JSON.stringify({ projectId: id })
          }),
          request(`${END_POINT}/api/sections?projectId=${selectedProject.id}`)
        ])
          .then(
            ([
              feedback,
              overviewData,
              historyData,
              sections
            ]) => {
              this.setOverviewData(overviewData);
              this.setHistoryData([historyData], [{ title: DEFAULT }]);

              if (sections && sections.length > 0) {
                this.sections = sections;
              }

              if (feedback.id) {
                this.feedback = feedback;
                this.projectData = feedback;
                this.feedbackState = FEEDBACK_STATE.LAST_FEEDBACK;
                this.review = feedback.review;
                this.eventName = feedback.event;
              } else {
                this.feedbackState = FEEDBACK_STATE.NO_FEEDBACK;
                this.projectData = {};
                this.eventName = "";
                this.review = "";
              }
              // trigger re-mount overview dashboard
              this.key = Math.random();
              this.isLoading = false;
            }
          )
          .catch(e => {
            console.log(e);
            this.isLoading = false;
            handleError(e, this.$router, this.$t("expired"));
          });
      }
    },

    handleRateChange({ sectionId, questionId, rating }) {
      this.projectData = {
        ...this.projectData,
        sections: this.projectData.sections.map(s => {
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
        })
      };
    },

    handleSubmitProject({ event, review }) {
      const { project } = this;
      this.isLoading = true;
      const requestBody = {
        projectId: project.id,
        review,
        event,
        sections: this.projectData.sections.map(section => ({
          title: section.title,
          order: section.order,
          questions: section.questions.map(question => ({
            rating: question.rating,
            text: question.text,
            order: question.order
          }))
        }))
      };

      request(`${END_POINT}/api/feedbacks`, {
        method: "POST",
        body: JSON.stringify(requestBody)
      })
        .then(() => {
          this.eventName = event;
          this.review = review;
          this.feedbackState = FEEDBACK_STATE.LAST_FEEDBACK;
          this.message.success(this.$t("feedback.thanks"));
        })
        .then(() => {
          // load dashboard data again
          Promise.all(
            [
              request(`${END_POINT}/api/dashboard/projects/summary`, {
                method: "POST",
                body: JSON.stringify({
                  sectionId:
                    this.overviewSection === DEFAULT
                      ? null
                      : this.overviewSection,
                  projectId:
                    this.project.id === DEFAULT ? null : this.project.id
                })
              })
            ].concat(
              this.historySections.length > 0
                ? this.historySections.map(section =>
                    request(`${END_POINT}/api/dashboard/projects/history`, {
                      method: "POST",
                      body: JSON.stringify({
                        sectionId: section.id === DEFAULT ? null : section.id,
                        projectId:
                          this.project.id === DEFAULT ? null : this.project.id
                      })
                    })
                  )
                : []
            )
          )
            .then(([overviewData, ...historyData]) => {
              this.setOverviewData(overviewData);
              this.setHistoryData(historyData, this.historySections);
              this.isLoading = false;
            })
            .catch(error => {
              this.isLoading = false;
              handleError(error, this.$router, this.$t("expired"));
            });
        })
        .catch(e => {
          this.isLoading = false;
          handleError(e, this.$router, this.$t("expired"));
        });
    },

    handleCancelProject() {
      if (this.feedback.id) {
        this.feedbackState = FEEDBACK_STATE.LAST_FEEDBACK;
        this.projectData = this.feedback;
      } else {
        this.feedbackState = FEEDBACK_STATE.NO_FEEDBACK;
      }
    },

    changeOverviewSection({ sectionTitle }) {
      this.isLoading = true;
      this.overviewSection = sectionTitle;
      request(`${END_POINT}/api/dashboard/projects/summary`, {
        method: "POST",
        body: JSON.stringify({
          sectionTitle: sectionTitle === DEFAULT ? null : sectionTitle,
          projectId: this.project.id === DEFAULT ? null : this.project.id
        })
      })
        .then(data => {
          this.setOverviewData(data);
          this.isLoading = false;
        })
        .catch(e => {
          this.isLoading = false;
          handleError(e, this.$router, this.$t("expired"));
        });
    },

    changeHistorySection({ sections }) {
      this.historySections = sections;
      if (sections.length > 0) {
        this.isLoading = true;
        Promise.all(
          sections.map(section =>
            request(`${END_POINT}/api/dashboard/projects/history`, {
              method: "POST",
              body: JSON.stringify({
                sectionTitle: section.title === DEFAULT ? null : section.title,
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
            handleError(e, this.$router, this.$t("expired"));
          });
      } else {
        this.historyData = [];
      }
    }
  }
};
</script>

<style scoped lang="scss">
.feedback-page-wrapper {
  .feedback-page-content {
    padding-top: $header-height;
    display: flex;
    position: relative;
    &::before {
      content: "";
      position: fixed;
      border: 2px solid $dark-blue-color;
      z-index: -1;
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
      right: calc((100% - 276px) / 2);
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

      @media screen and (max-width: 390px) {
        .feedback-page-content-left-header {
          flex-direction: column;
          align-items: normal !important;
        }
      }

      .feedback-page-content-left-header {
        @include header-wrapper;

        .feedback-page-content-left-header-text {
          @include header-text;
        }

        .feedback-page-content-left-header-new {
          text-transform: uppercase;
          margin-right: 10px;
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
