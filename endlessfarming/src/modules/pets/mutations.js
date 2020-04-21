import Vue from "vue";
import _ from "lodash";
import getDefaultState from "./index.js";

export const mutations = {
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
  updatePet(state, pet) {
    let idx = state.data.indexOf((p) => p._id == pet._id);
    let pets = state.data;
    pets[idx] = pet;
    var mergedList = _.map(pets, function(item) {
      return _.extend(item, _.find([pet], { id: item._id }));
    });
    Vue.set(state, "data", mergedList);
  },
  setPetsData(state, { pets, storageName }) {
    if (storageName == "pets") {
      Vue.set(state, "data", pets);
    } else if (storageName == "pets_hard") {
      Vue.set(state, "dataHard", pets);
    } else {
      Vue.set(state, "dataOther", pets);
    }
  },
};
