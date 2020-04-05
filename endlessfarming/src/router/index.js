import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Meta from "../views/Meta.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/meta",
    name: "Meta",
    component: Meta,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
