<template>
  <div class="project-feedback-wrapper">
    <div>
      <div v-if="feedbackStates.LAST_FEEDBACK === state" class="project-feedback-event">
        <div class="project-feedback-event-container" v-if="event">
          <div class="project-feedback-event-label">{{ $t("feedback.last-event") }}</div>
          <div class="project-feedback-event">{{ event }}</div>
        </div>
        <div class="project-feedback-event-container" v-else>
          <div class="project-feedback-event-label">{{ $t("feedback.last-no-event") }}</div>
          <div class="project-feedback-event">{{ createdAt }}</div>
        </div>
      </div>
      <div v-else class="project-feedback-event">
        <div class="project-feedback-event-label">{{ $t("feedback.event") }}</div>
        <div>
          <Input v-model="eventName" :placeholder="$t('feedback.milestone')" />
        </div>
      </div>
    </div>
    <div
      v-for="section in projectData.sections || []"
      :key="section.id"
      class="project-feedback-section"
    >
      <div class="project-feedback-section-header">{{ section.title }}</div>
      <div>
        <div v-for="(question, qIdx) in section.questions" :key="question.id">
          <QuestionRow
            :ratings="ratings"
            :question="{ ...question, index: qIdx + 1 }"
            @ratechange="handleRateChange({ sectionId: section.id }, $event)"
          />
        </div>
      </div>
    </div>
    <div class="project-feedback-review">
      <div class="project-feedback-section-header">{{ $t("feedback.review") }}</div>
      <TextArea
        v-if="feedbackStates.NEW_FEEDBACK === state"
        v-model="reviewText"
        class="project-feedback-review-input"
        :placeholder="$t('feedback.write-review')"
      />
      <div v-if="feedbackStates.LAST_FEEDBACK === state">
        <div>{{ review }}</div>
      </div>
    </div>
    <div class="feedback-button-wrapper" v-if="feedbackStates.LAST_FEEDBACK !== state">
      <Button type="primary" class="feedback-button" @click="handleCancel">
        {{
        $t("feedback.cancel")
        }}
      </Button>
      <Button type="primary" class="feedback-button" @click="handleSubmit">
        {{
        $t("feedback.submit")
        }}
      </Button>
    </div>
  </div>
</template>
<script>
import { Button, Input } from "ant-design-vue";
import moment from "moment";

import QuestionRow from "./QuestionRow";

import { FEEDBACK_STATE } from "../config";

const { TextArea } = Input;

export default {
  name: "ProjectFeedback",
  components: {
    Button,
    Input,
    QuestionRow,
    TextArea
  },
  watch: {
    state(val) {
      if (val === FEEDBACK_STATE.NEW_FEEDBACK) {
        this.eventName = "";
        this.reviewText = "";
      }
    }
  },
  computed: {
    createdAt() {
      return moment(this.projectData.createdAt).format("YYYY-MM-DD");
    }
  },
  props: {
    projectData: Object,
    ratings: Array,
    state: String,
    event: String,
    review: String
  },
  data() {
    return {
      eventName: "",
      reviewText: "",
      feedbackStates: FEEDBACK_STATE
    };
  },
  methods: {
    handleRateChange({ sectionId }, { rating, questionId }) {
      if (this.feedbackStates.LAST_FEEDBACK !== this.state) {
        this.$emit("ratechange", { sectionId, rating, questionId });
      }
    },

    handleSubmit() {
      const { eventName, reviewText } = this;
      this.$emit("submitProject", { event: eventName, review: reviewText });
    },

    handleCancel() {
      this.$emit("cancelProject");
    }
  }
};
</script>
<style scoped lang="scss">
.project-feedback-wrapper {
  color: rgba(0, 0, 0, 0.65);

  @media screen and (max-width: 576px) {
    .project-feedback-event {
      flex-direction: column;
      align-items: normal !important;
    }
  }

  .project-feedback-event {
    display: flex;
    align-items: center;

    .project-feedback-event-container {
      display: flex;
      align-items: center;
    }

    .project-feedback-event-label {
      margin-right: 10px;
      font-size: 22px;
      color: #22282d;
    }

    .project-feedback-event {
      padding-top: 3px;
    }
  }

  .project-feedback-section {
    padding-top: 20px;

    .project-feedback-section-header {
      font-size: 22px;
      color: #22282d;
    }
  }

  .project-feedback-review {
    margin-top: 40px;
    padding-bottom: 20px;

    .project-feedback-section-header {
      font-size: 22px;
      color: #22282d;
      padding-bottom: 20px;
    }

    .project-feedback-review-input {
      resize: none;
    }
  }

  .feedback-button-wrapper {
    padding: 20px 20px 20px 0;
    display: flex;
    justify-content: flex-end;

    .feedback-button {
      background-color: #ec1940;
      border-color: #ec1940;
      text-transform: uppercase;
      margin-right: 10px;
    }
  }
}
</style>
