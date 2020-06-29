<template>
  <div class="project-feedback-wrapper">
    <div class="project-feedback-event">
      <div class="project-feedback-event-label">{{$t('feedback.event')}}</div>
      <div>
        <Input
          :defaultValue="event"
          v-model="eventName"
          :disabled="feedbackStates.LAST_FEEDBACK === state"
        />
      </div>
    </div>
    <div v-for="section in sections" :key="section.id" class="project-feedback-section">
      <div class="project-feedback-section-header">{{section.title}}</div>
      <div>
        <div v-for="(question, qIdx) in section.questions" :key="question.id">
          <QuestionRow
            :ratings="ratings"
            :question="{...question, index: qIdx + 1}"
            @ratechange="handleRateChange({sectionId: section.sectionId}, $event)"
          />
        </div>
      </div>
    </div>
    <div class="project-feedback-review">
      <div style="padding-bottom: 20px">
        <div class="project-feedback-section-header" style="padding-bottom: 20px">{{$t('feedback.review')}}</div>
        <TextArea
          v-if="feedbackStates.NEW_FEEDBACK === state"
          :defaultValue="review"
          v-model="reviewText"
          style="resize: none"
          placeholder="Write a review"
        />
        <div v-if="feedbackStates.LAST_FEEDBACK === state">
          <div>{{review}}</div>
        </div>
      </div>
    </div>
    <div class="feedback-button-wrapper" v-if="feedbackStates.LAST_FEEDBACK !== state">
      <Button type="primary" class="feedback-button" @click="handleSubmit">{{$t("feedback.submit")}}</Button>
    </div>
  </div>
</template>
<script>
import { Button, Input } from "ant-design-vue";

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
  props: {
    sections: Array,
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
    }
  }
};
</script>
<style scoped lang="scss">
.project-feedback-wrapper {
  color: rgba(0, 0, 0, 0.65);

  .project-feedback-event {
    display: flex;
    align-items: center;

    .project-feedback-event-label {
      margin-right: 10px;
      font-size: 22px;
      color: #22282d;
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
    .project-feedback-section-header {
      font-size: 22px;
      color: #22282d;
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
    }
  }
}
</style>
