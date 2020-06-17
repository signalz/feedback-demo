<template>
  <div class="question-row-wrapper">
    <div class="question-number">{{question.index}}</div>
    <div class="question-text"><span>{{question.index}}.</span>{{question.text}}</div>
    <div class="question-rating">
      <FeedbackIcon
        v-for="rating in ratings"
        :key="`rating-${rating.id}`"
        :ratingId="rating.id"
        :type="rating.icon"
        :selected="question.ratingId === rating.id"
        :label="rating.label"
        @ratechange="handleRateChange"
      />
    </div>
  </div>
</template>

<script>
import FeedbackIcon from "./FeedbackIcon";

export default {
  name: "QuestionRow",
  components: {
    FeedbackIcon
  },
  props: {
    ratings: Array,
    question: Object,
    projectIdx: Number,
    section: String,
  },
  methods: {
    handleRateChange({ ratingId }) {
      const { section, projectIdx, question } = this
      this.$emit("ratechange", {
        ratingId,
        questionId: question.id,
        projectIdx: projectIdx,
        section,
      });
    }
  },
};
</script>

<style scoped lang="scss">

@media screen and(max-width: $phone-width) {
  .question-row-wrapper {
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .question-number {
      display: none;
    }

    .question-text {
      width: 100% !important;
      background-color: aliceblue;
      padding: 10px;

      span {
        display: inline-block !important;
        margin-right: 5px;
      }
    }

    .question-rating {
      width: 60% !important;
      margin-top: 20px;
    }
  }
}

.question-row-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .question-number {
    width: 5%;
  }

  .question-text {
    width: 60%;

    span {
      display: none;
    }
  }

  .question-rating {
    width: 35%;
    display: flex;
    justify-content: space-between;
    font-size: 20px;
  }
}
</style>
