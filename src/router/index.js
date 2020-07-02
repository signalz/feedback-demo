import Vue from "vue";
import VueRouter from "vue-router";

import { request } from "../api";
import { END_POINT } from "../config";

import FeedbackPage from "../components/FeedbackPage.vue";
import LoginPage from "../components/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Feedback",
    component: FeedbackPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage
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
    path: "*",
    name: "Notfound",
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/NotFoundPage.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const jwt = localStorage.getItem("jwt");
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (jwt === null) {
      next({
        path: "/login",
        params: { nextUrl: to.fullPath }
      });
    } else {
      request(`${END_POINT}/signin-with-token`, { method: "POST" })
        .then(() => {
          next();
        })
        .catch(e => {
          localStorage.removeItem("jwt");
          console.log(e);
          next({
            path: "/login",
            params: { nextUrl: to.fullPath }
          });
        });
      // next();
      // let user = JSON.parse(localStorage.getItem("user"));
      // if (to.matched.some(record => record.meta.is_admin)) {
      //   if (user.is_admin == 1) {
      //     next();
      //   } else {
      //     next({ name: "userboard" });
      //   }
      // } else {
      //   next();
      // }
    }
    // } else if (to.matched.some(record => record.meta.guest)) {
    //   if (localStorage.getItem("jwt") == null) {
    //     next();
    //   } else {
    //     next({ name: "userboard" });
    //   }
    // } else {
  } else {
    if (to.path === '/login') {
      if (jwt === null) {
        next()
      } else {
        request(`${END_POINT}/signin-with-token`, { method: "POST" })
        .then(() => {
          next({
            path: "/",
            params: { nextUrl: to.fullPath }
          });
        })
        .catch(e => {
          localStorage.removeItem("jwt");
          console.log(e);
          next({
            path: "/login",
            params: { nextUrl: to.fullPath }
          });
        });
      }
    } else {
      next();
    }
  }
});

export default router;
