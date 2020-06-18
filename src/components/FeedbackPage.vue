<template>
  <div tabindex="0" @keydown.esc="handleEsc" class="feedback-page-wrapper">
    <Menu :projects="projects" :selectedProject="project" @selectProject="handleSelectProject" />
    <Loading isSpin v-if="isLoading" />
    <div class="no-project" v-if="!project">
      <NoProjectSelected />
    </div>
    <div class="submitted-project" v-if="status === feedbackStatus.SUBMITTED">
      <SubmittedProject />
    </div>
    <div v-if="project && status === feedbackStatus.DRAFT" class="project-feedback">
      <ProjectFeedback
        :sections="sections"
        :ratings="ratings"
        @ratechange="handleRateChange"
        @closeProject="handleCloseProject"
        @submitProject="handleSubmitProject"
      />
    </div>
  </div>
</template>

<script>
import { message } from "ant-design-vue";

import Loading from "./Loading";
import Menu from "./Menu";
import NoProjectSelected from "./NoProjectSelected";
import ProjectFeedback from "./ProjectFeedback";
import SubmittedProject from "./SubmittedProject";

import { END_POINT } from "../config";
import { FEEDBACK_STATUS, RATINGS } from "../config";

export default {
  name: "FeedbackPage",
  mounted() {
    Promise.all([
      fetch(`${END_POINT}/api/projects`).then(res => res.json()),
      fetch(`${END_POINT}/api/sections`).then(res => res.json())
    ])
      .then(([projects, sections]) => {
        if (sections && sections.length > 0) {
          this.sections = sections;
        }

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
    ProjectFeedback,
    SubmittedProject
  },
  data: () => {
    return {
      sections: [],
      projects: [],
      ratings: [],
      project: undefined,
      message,
      isLoading: true,
      feedbackStatus: FEEDBACK_STATUS,
      status: FEEDBACK_STATUS.DRAFT
    };
  },
  methods: {
    handleSelectProject({ id }) {
      this.project = id;
    },

    handleRateChange({ sectionId, questionId, ratingId }) {
      this.sections = this.sections.map(s => {
        if (s.id === sectionId) {
          return {
            ...s,
            questions: s.questions.map(q => {
              if (q.id === questionId) {
                return {
                  ...q,
                  ratingId
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
      this.status = FEEDBACK_STATUS.SUBMITTED;
    }
  }
};
</script>

<style scoped lang="scss">
.feedback-page-wrapper:focus {
  outline: none;
}

.no-project,
.submitted-project {
  padding-top: 100px;
}

@media screen and (min-width: $desktop-width) {
  .project-feedback {
    padding-left: 320px !important;
    padding-top: 50px !important;
  }
}

.project-feedback {
  padding-top: 100px;
  padding-left: 20px;
  color: #7a7e81;
  padding-right: 20px;
}
</style>
