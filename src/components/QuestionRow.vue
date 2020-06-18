<template>
  <div class="question-row-wrapper">
    <div class="question-text"><span>{{question.index}}.</span>{{question.text}}</div>
    <div class="question-rating">
      <FeedbackIcon
        v-for="rating in ratings"
        :key="`rating-${rating.rate}`"
        :rate="rating.rate"
        :selected="question.rating === rating.rate"
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
  },
  methods: {
    handleRateChange({ rating }) {
      const { question } = this
      this.$emit("ratechange", {
        rating,
        questionId: question.id,
      });
    }
  },
};
</script>

<style scoped lang="scss">

@media screen and(max-width: $tablet-width) {
  .question-row-wrapper {
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .question-text {
      width: 100% !important;
      background-color: aliceblue;
      padding: 10px;
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
  margin-bottom: 10px;

  .question-text {
    width: 70%;
  }

  .question-rating {
    width: 30%;
    display: flex;
    justify-content: space-between;
    font-size: 20px;
  }
}
</style>
