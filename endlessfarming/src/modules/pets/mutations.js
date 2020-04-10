import Vue from "vue";
import _ from "lodash";

export const mutations = {
  updatePet(state, pet) {
    let idx = state.data.indexOf(p => p.name == pet.name);
    let pets = state.data;
    pets[idx] = pet;
    var mergedList = _.map(pets, function(item) {
      return _.extend(item, _.find([pet], { name: item.name }));
    });

    Vue.set(state, "data", mergedList);
  },
  setPetsData(state, pets) {
    Vue.set(state, "data", pets);
  }
};
