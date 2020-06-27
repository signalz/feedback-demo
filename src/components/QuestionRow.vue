<template>
  <div class="question-row-wrapper">
    <div class="question-text">
      <span>{{question.index}}.</span>
      {{question.text}}
    </div>
    <div class="question-rating">
      <FeedbackIcon
        v-for="rating in ratings"
        :key="rating.label"
        :rating="rating.rating"
        :selected="question.rating === rating.rating"
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
    ratings: {
      type: Array,
      default: () => {
        return [
          {
            label: String,
            rating: Number
          }
        ];
      }
    },
    question: {
      type: Object,
      default: () => {
        return {
          questionId: String,
          index: Number,
          text: String
        };
      }
    }
  },
  methods: {
    handleRateChange({ rating }) {
      this.$emit("ratechange", {
        rating,
        questionId: this.question.questionId
      });
    }
  }
};
</script>

<style scoped lang="scss">
.question-row-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;

  .question-text {
    width: 100%;
    background-color: aliceblue;
    padding: 10px;
  }

  .question-rating {
    width: 60%;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    font-size: 20px;
  }
}
</style>
