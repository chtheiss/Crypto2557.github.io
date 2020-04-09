import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Meta from "../views/Meta.vue";
import Pets from "../views/Pets.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/meta",
    name: "Meta",
    component: Meta
  },
  {
    path: "/pets/normal",
    name: "Pets",
    component: Pets
  }
];

const router = new VueRouter({
  routes
});

export default router;
