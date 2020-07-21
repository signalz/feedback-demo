import Vue from "vue";
import VueRouter from "vue-router";

import { request } from "../api";
import { END_POINT, JWT, ROLE_ADMIN } from "../config";
import $store, { LOGIN_ACTION } from "../store";

import FeedbackPage from "../components/FeedbackPage.vue";
import LoginPage from "../components/LoginPage.vue";
import AdminPage from "../components/AdminPage.vue";

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
  {
    path: "/admin",
    name: "Admin",
    component: AdminPage,
    meta: {
      requiresAuth: true,
      isAdmin: true
    }
  },
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
  const jwt = localStorage.getItem(JWT);
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (jwt === null) {
      next({
        path: "/login",
        params: { nextUrl: to.fullPath }
      });
    } else {
      request(`${END_POINT}/signin-with-token`, { method: "POST" })
        .then(user => {
          $store.commit(LOGIN_ACTION, user)
          if (to.matched.some(record => record.meta.isAdmin)) {
            // if (user.roles.includes(ROLE_ADMIN) || user.roles.includes(ROLE_SUPERVISOR)) {
            if (user.roles.includes(ROLE_ADMIN)) {
              next();
            } else {
              next({ path: "/", params: { nextUrl: to.fullPath } });
            }
          } else {
            next();
          }
        })
        .catch(e => {
          localStorage.removeItem(JWT);
          $store.commit(LOGIN_ACTION, {})
          next({
            path: "/login",
            params: { nextUrl: to.fullPath }
          });
          console.log(e);
        });
    }
  } else {
    if (to.path === "/login") {
      if (jwt === null) {
        next();
      } else {
        request(`${END_POINT}/signin-with-token`, { method: "POST" })
          .then(() => {
            next({
              path: "/",
              params: { nextUrl: to.fullPath }
            });
          })
          .catch(e => {
            localStorage.removeItem(JWT);
            $store.commit(LOGIN_ACTION, {})
            next({
              path: "/login",
              params: { nextUrl: to.fullPath }
            });
            console.log(e);
          });
      }
    } else {
      next();
    }
  }
});

export default router;
