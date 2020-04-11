import { getters } from "./getters";
import { actions } from "./actions";
import { mutations } from "./mutations.js";

const state = {
  data: [],
  tickets: []
};

const namespaced = true;

export const units = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
