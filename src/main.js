import Vue from 'vue'
import VueMq from 'vue-mq'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

import { SCREEN_BREAK_POINTS_DEFINITION, SCREEN_BREAK_POINTS_VALUE } from './config'

Vue.config.productionTip = false

Vue.use(VueMq, {
  breakpoints: {
    // default breakpoints - customize this
    [SCREEN_BREAK_POINTS_DEFINITION.xxs]: SCREEN_BREAK_POINTS_VALUE.xxs,
    [SCREEN_BREAK_POINTS_DEFINITION.xs]: SCREEN_BREAK_POINTS_VALUE.xs,
    [SCREEN_BREAK_POINTS_DEFINITION.sm]: SCREEN_BREAK_POINTS_VALUE.sm,
    [SCREEN_BREAK_POINTS_DEFINITION.md]: SCREEN_BREAK_POINTS_VALUE.md,
    [SCREEN_BREAK_POINTS_DEFINITION.lg]: SCREEN_BREAK_POINTS_VALUE.lg,
    [SCREEN_BREAK_POINTS_DEFINITION.xl]: SCREEN_BREAK_POINTS_VALUE.xl
  }
  // defaultBreakpoint: 'sm' // customize this for SSR
});

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
