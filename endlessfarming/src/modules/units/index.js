import { getters } from "./getters";
import { actions } from "./actions";
import { mutations } from "./mutations.js";

const getDefaultState = () => {
  return {
    data: [],
    tickets: []
  };
};
const state = getDefaultState();

const namespaced = true;

export const units = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};

export default getDefaultState;
