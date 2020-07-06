<template>
  <div class="project-feedback-wrapper">
    <div class="project-feedback-event">
      <div
        class="project-feedback-event-label"
      >{{feedbackStates.LAST_FEEDBACK === state ? $t('feedback.last-event') : $t('feedback.event')}}</div>
      <div>
        <Input
          v-if="feedbackStates.NEW_FEEDBACK === state"
          v-model="eventName"
          :disabled="feedbackStates.LAST_FEEDBACK === state"
        />
        <div v-else>
          <div class="padding-top-3">{{event}}</div>
        </div>
      </div>
    </div>
    <div v-for="section in sections" :key="section.id" class="project-feedback-section">
      <div class="project-feedback-section-header">{{section.title}}</div>
      <div>
        <div v-for="(question, qIdx) in section.questions" :key="question.id">
          <QuestionRow
            :ratings="ratings"
            :question="{...question, index: qIdx + 1}"
            @ratechange="handleRateChange({sectionId: section.id}, $event)"
          />
        </div>
      </div>
    </div>
    <div class="project-feedback-review">
      <div class="project-feedback-section-header">{{$t('feedback.review')}}</div>
      <TextArea
        v-if="feedbackStates.NEW_FEEDBACK === state"
        v-model="reviewText"
        class="project-feedback-review-input"
        :placeholder="$t('feedback.write-review')"
      />
      <div v-if="feedbackStates.LAST_FEEDBACK === state">
        <div>{{review}}</div>
      </div>
    </div>
    <div class="feedback-button-wrapper" v-if="feedbackStates.LAST_FEEDBACK !== state">
      <Button type="primary" class="feedback-button" @click="handleCancel">{{$t("feedback.cancel")}}</Button>
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
    },

    handleCancel() {
      this.$emit('cancelProject')
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
    
    .padding-top-3{
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
