import Vue from "vue";
import getDefaultState from "./index.js";

export const mutations = {
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
  updateUnit(state, unit) {
    let idx = state.data.indexOf(u => u._id == unit.id);
    let units = state.data;
    units[idx] = unit;
    console.log(units);
    Vue.set(state, "data", units);
  },
  setUnitsData(state, units) {
    Vue.set(state, "data", units);
  },
  setTickets(state, tickets) {
    Vue.set(state, "tickets", tickets);
  }
};
