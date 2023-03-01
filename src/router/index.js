import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import { CHECK_AUTH } from "@/store/actions.type";

import Login from "@/views/Login";
import Song from "@/views/song/Index";
import History from "@/views/history/Index";
import HistoryDetail from "@/views/history/Detail";
import Home from "@/views/Home";
import User from "@/views/user/Index";
import Band from "@/views/play/Band";
import PlaySong from "@/views/play/Song";
import PlayLevel from "@/views/play/Level";
import PlayDevice from "@/views/play/Device";
import PlayPlayer from "@/views/play/Player";
import PlayResult from "@/views/play/Result";

Vue.use(VueRouter);

export const nonAuthOnly = (to, from, next) => {
  Promise.all([store.dispatch(CHECK_AUTH)])
    .then(() => next("/"))
    .catch(() => next());
};

export const auth = (to, from, next) => {
  Promise.all([store.dispatch(CHECK_AUTH)])
    .then(next)
    .catch(() => {
      next("/login");
    });
};

const router = new VueRouter({
  routes: [
    {
      name: "home",
      path: "/",
      beforeEnter: auth,
      component: Home,
    },
    {
      name: "song",
      path: "/song",
      beforeEnter: auth,
      component: Song,
    },
    {
      name: "history",
      path: "/history",
      beforeEnter: auth,
      component: History,
    }, {
      name: "historyDetail",
      path: "/history/detail",
      beforeEnter: auth,
      component: HistoryDetail,
    },
    {
      name: "user",
      path: "/User",
      beforeEnter: auth,
      component: User,
    },
    {
      name: "login",
      path: "/login",
      beforeEnter: nonAuthOnly,
      component: Login,
    },
    {
      name: "pickBand",
      path: "/play/band",
      beforeEnter: auth,
      component: Band,
    },
    {
      name: "pickSong",
      path: "/play/song",
      beforeEnter: auth,
      component: PlaySong,
    },
    {
      name: "level",
      path: "/play/level",
      beforeEnter: auth,
      component: PlayLevel,
    },
    {
      name: "device",
      path: "/play/device",
      beforeEnter: auth,
      component: PlayDevice,
    },
    {
      name: "player",
      path: "/play/player",
      beforeEnter: auth,
      component: PlayPlayer,
    },
    {
      name: "result",
      path: "/play/result",
      beforeEnter: auth,
      component: PlayResult,
    },
  ],
});

// router.beforeEach((to, from, next) =>
//   Promise.all([store.dispatch(CHECK_AUTH)])
//     .then(next)
//     .catch(() => {
//       console.log(to);
//       if (to.name !== "login") {
//         console.log("beforeCatch");
//         next();
//         next({ name: "login" });
//       }
//     })

// );

console.log("router", router);

export default router;
