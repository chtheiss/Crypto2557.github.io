import Vue from "vue";

export const mutations = {
  updateStat(state, stat) {
    Vue.set(state, stat.name, stat.value);
  },
};
