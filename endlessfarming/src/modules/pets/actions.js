import idb from "@/api/idb";
import axios from "axios";
import _ from "lodash";

export const actions = {
  resetState({ commit }) {
    commit("resetState");
  },
  async saveValue(context, value) {
    let idbValue = {
      name: value.name,
      fragments: value.fragments,
      priority: value.priority
    };
    let storageName;
    if (value.origin.includes("shn")) {
      storageName = "pets";
    } else if (value.origin.includes("shh")) {
      storageName = "pets_hard";
    } else {
      storageName = "pets_other";
    }
    await idb.savePet(idbValue, storageName);
    context.commit("updatePet", value);
  },
  async getPetsData(context, { origin, storageName }) {
    let petsData = await axios.get(
      `https://endless-farming-backend.herokuapp.com/api/v1/priority/${origin}`
    );
    let data = petsData.data.data[0].pets;
    for (let i = 0; i < data.length; i++) {
      data[i].priority = i;
    }
    let pets = await idb.getPets(storageName);
    let mergedList = _.map(data, function(item) {
      return _.extend(item, _.find(pets, { name: item.name }));
    });
    let petPromises = [];
    for (const pet of mergedList) {
      if (pet.fragments == undefined) {
        pet.fragments = 0;
        petPromises.push(
          idb.savePet(
            {
              name: pet.name,
              fragments: pet.fragments,
              priority: pet.priority
            },
            storageName
          )
        );
      }
    }
    await Promise.all(petPromises);
    mergedList = _.sortBy(mergedList, "priority");

    console.log("pets/getPetsData");
    context.commit("setPetsData", {
      pets: mergedList,
      storageName: storageName
    });
  },
  async getOtherPetsData(context, origins) {
    let petPromises = [];
    for (const origin of origins) {
      petPromises.push(
        axios.get(
          `https://endless-farming-backend.herokuapp.com/api/v1/priority/${origin}`
        )
      );
    }
    let petsData = await Promise.all(petPromises);
    let pets_hard = await idb.getPets("pets_hard");
    let pets_other = await idb.getPets("pets_other");
    let pets = [];
    for (const petStorage of [pets_hard, pets_other]) {
      let dict = {};
      for (const key in petStorage) {
        dict[petStorage[key].name] = petStorage[key];
      }
      pets.push(dict);
    }
    pets = Object.assign(...pets);
    for (let i = 0; i < petsData.length; i++) {
      let data = petsData[i];
      data = data.data.data[0].pets;
      for (let i = 0; i < data.length; i++) {
        data[i].priority = i;
      }
      let mergedList = _.map(data, function(item) {
        return _.extend(item, _.find(pets, { name: item.name }));
      });
      let petPromises = [];
      for (const pet of mergedList) {
        if (pet.fragments == undefined) {
          pet.fragments = 0;
          petPromises.push(
            idb.savePet(
              {
                name: pet.name,
                fragments: pet.fragments,
                priority: pet.priority
              },
              pet.origin.includes("shh") ? "pets_hard" : "pets_other"
            )
          );
        }
      }
      await Promise.all(petPromises);
      petsData[i] = data;
    }
    console.log("pets/getOtherPetsData");
    context.commit("setPetsData", {
      pets: [].concat(...petsData),
      storageName: undefined
    });
  }
};
