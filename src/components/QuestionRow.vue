<template>
  <div class="question-row-wrapper">
    <div class="question-number">{{question.index}}</div>
    <div class="question-text">{{question.text}}</div>
    <div class="question-rating">
      <FeedbackIcon
        v-for="rating in ratings"
        :key="`rating-${rating.id}`"
        :ratingId="rating.id"
        :type="rating.icon"
        :selected="question.ratingId === rating.id"
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
    projectIdx: Number
  },
  methods: {
    handleRateChange({ ratingId }) {
      this.$emit("ratechange", {
        ratingId,
        questionId: this.question.id,
        projectIdx: this.projectIdx
      });
    }
  },
  // watch: {
  //   question(newValue) {
  //     console.log(newValue);
  //   }
  // }
};
</script>

<style scoped lang="scss">
.question-row-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .question-number {
    width: 5%;
  }

  .question-text {
    width: 75%;
  }

  .question-rating {
    width: 20%;
    display: flex;
    justify-content: space-between;
    font-size: 20px;
  }
}
</style>
