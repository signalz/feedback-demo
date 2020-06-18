<template>
  <div class="project-feedback-wrapper">
    <div class="project-feedback-keyboard">
      <div class="project-feedback-keyboard-icons" @click="handleClose">
        <Icon type="close" :style="{fontSize: '24px'}" />
        <span>{{$t("feedback.esc")}}</span>
      </div>
    </div>
    <div class="project-feedback-header">{{$t("feedback.header")}}</div>
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
    <div class="feedback-button-wrapper">
      <Button type="primary" class="feedback-button" @click="handleSubmit">{{$t("feedback.submit")}}</Button>
    </div>
  </div>
</template>
<script>
import { Button, Icon } from "ant-design-vue";

import QuestionRow from "./QuestionRow";

export default {
  name: "ProjectFeedback",
  components: {
    Button,
    Icon,
    QuestionRow
  },
  props: {
    sections: Array,
    ratings: Array
  },
  methods: {
    handleRateChange({ sectionId }, { ratingId, questionId }) {
      this.$emit("ratechange", { sectionId, ratingId, questionId });
    },
    handleClose() {
      this.$emit('closeProject')
    },

    handleSubmit() {
      this.$emit('submitProject')
    }
  }
};
</script>
<style scoped lang="scss">
.project-feedback-wrapper {
  .project-feedback-keyboard {
    display: flex;
    justify-content: flex-end;

    .project-feedback-keyboard-icons {
      width: 5%;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
    }
  }

  .project-feedback-header {
    padding-top: 20px;
    color: #ec1940;
    font-size: 24px;
    font-weight: bold;
  }

  .project-feedback-section {
    padding-top: 20px;

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
