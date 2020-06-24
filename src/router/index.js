import Vue from 'vue'
import VueRouter from 'vue-router'

import FeedbackPage from '../components/FeedbackPage.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Feedback',
    component: FeedbackPage
  },
  // {
  //   path: '/dashboard',
  //   name: 'Dashboard',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../components/DashboardPage.vue')
  // },
  {
    path: '*',
    name: 'Notfound',
    component: () => import(/* webpackChunkName: "about" */ '../components/NotFoundPage.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
