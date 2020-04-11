import { getters } from "./getters";
import { actions } from "./actions";
import { mutations } from "./mutations";

const state = {
  data: [],
  dataHard: [],
  dataOther: [],
};

const namespaced = true;

export const pets = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
