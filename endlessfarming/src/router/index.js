import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

function lazyLoad(view) {
  return () => import(`@/views/${view}.vue`);
}

const routes = [
  {
    path: "/",
    name: "Home",
    component: lazyLoad("Home"),
  },
  {
    path: "/meta",
    name: "Meta",
    component: lazyLoad("Meta"),
  },
  {
    path: "/pets/normal",
    name: "Pets",
    component: lazyLoad("Pets"),
  },
  {
    path: "/pets/hard",
    name: "PetsHard",
    component: lazyLoad("PetsHard"),
  },
  {
    path: "/pets/other",
    name: "PetsOther",
    component: lazyLoad("PetsOther"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
