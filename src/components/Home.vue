<template>
  <div>
    123456
    <FeedbackIcon type="dislike" selected />
    <FeedbackIcon type="frown" selected />
    <FeedbackIcon type="meh" selected />
    <FeedbackIcon type="smile" selected />
    <FeedbackIcon type="like" selected />
  </div>
</template>

<script>
import FeedbackIcon from "./FeedbackIcon.vue"

export default {
  name: 'Home',
  components: {
    FeedbackIcon
  }
}
</script>

<style scoped>
</style>
