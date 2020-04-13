import Vue from "vue";
import getDefaultState from "./index.js";

export const mutations = {
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
  updateStat(state, stat) {
    Vue.set(state, stat.name, stat.value);
  }
};
