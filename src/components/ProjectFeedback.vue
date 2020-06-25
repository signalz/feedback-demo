<template>
  <div class="project-feedback-wrapper">
    <div class="project-feedback-event">
      <div class="project-feedback-event-label">Event:</div>
      <div><Input v-model="event" /></div>
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
      <div><TextArea v-model="review" style="resize: none" placeholder="Write a review" /></div>
    </div>
    <div class="feedback-button-wrapper">
      <Button type="primary" class="feedback-button" @click="handleSubmit">{{$t("feedback.submit")}}</Button>
    </div>
  </div>
</template>
<script>
import { Button, Input } from "ant-design-vue";

import QuestionRow from "./QuestionRow";

const { TextArea } = Input

export default {
  name: "ProjectFeedback",
  components: {
    Button,
    Input,
    QuestionRow,
    TextArea
  },
  props: {
    sections: Array,
    ratings: Array
  },
  data() {
    return {
      event: '',
      review: ''
    }
  },
  methods: {
    handleRateChange({ sectionId }, { rating, questionId }) {
      this.$emit("ratechange", { sectionId, rating, questionId });
    },

    handleSubmit() {
      console.log(this.event)
      // this.$emit('submitProject')
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
