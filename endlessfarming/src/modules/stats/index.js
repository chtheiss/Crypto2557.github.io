import { getters } from "./getters";
import { actions } from "./actions";
import { mutations } from "./mutations";

const state = {
  KL: 0,
  hide_five_star_pets: 0,
  hide_unattainable_pets: 0,
  refills: 0,
  refills_hard: 0,
  tickets: 0,
  tickets_hard: 0,
};

const namespaced = true;

export const stats = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
