import Vue from "vue";

export const mutations = {
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
