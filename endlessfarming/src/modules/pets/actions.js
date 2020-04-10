import idb from "@/api/idb";
import axios from "axios";
import _ from "lodash";

export const actions = {
  async saveValue(context, value) {
    let idbValue = {
      name: value.name,
      fragments: value.fragments,
      priority: value.priority,
    };
    await idb.savePet(idbValue);
    context.commit("updatePet", value);
  },
  async getPetsData(context) {
    let petsData = await axios.get(
      "https://endless-farming-backend.herokuapp.com/api/v1/priority/shn"
    );
    let data = petsData.data.data[0].pets;
    for (let i = 0; i < data.length; i++) {
      data[i].priority = i;
    }
    let pets = await idb.getPets();
    let mergedList = _.map(data, function (item) {
      return _.extend(item, _.find(pets, { name: item.name }));
    });
    let petPromises = [];
    for (const pet of mergedList) {
      if (pet.fragments == undefined) {
        pet.fragments = 0;
        petPromises.push(
          idb.savePet({
            name: pet.name,
            fragments: pet.fragments,
            priority: pet.priority,
          })
        );
      }
    }
    await Promise.all(petPromises);
    mergedList = _.sortBy(mergedList, "priority");
    context.commit("setPetsData", mergedList);
  },
};
