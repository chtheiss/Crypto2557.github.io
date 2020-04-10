<template>
  <div class="pet-buttons">
    <v-btn light id="reset-btn" v-on:click="resetPriority">Reset Priority</v-btn>
    <v-btn light id="add-all-btn" v-on:click="progressOneDay">Progress 1 Day</v-btn>
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";

export default {
  name: "PetButtons",
  props: ["fragmentsToFarm"],
  methods: {
    resetPriority: async function() {
      let originalPetsData = await axios.get(
        "https://endless-farming-backend.herokuapp.com/api/v1/priority/shn"
      );
      let originalPets = originalPetsData.data.data[0].pets;
      let pets = this.petsData;
      var mergedList = _.map(originalPets, function(item) {
        return _.extend(item, _.find(pets, { name: item.name }));
      });
      for (let i = 0; i < mergedList.length; i++) {
        mergedList[i].priority = i;
      }
      this.$store.commit("pets/setPetsData", mergedList);
      for (const pet of mergedList) {
        await this.$store.dispatch("pets/saveValue", pet);
      }
    },
    progressOneDay: async function() {
      for (let farmObj of this.fragmentsToFarm.filter(
        obj => obj.farmableFragments > 0
      )) {
        let pet = this.petsData.filter(pet => pet._id == farmObj.petid)[0];
        pet.fragments += farmObj.farmableFragments;
        this.$store.dispatch("pets/saveValue", pet);
      }
    }
  },
  computed: {
    petsData: function() {
      return this.$store.state.pets.data;
    }
  }
};
</script>

<style scoped>
.pet-buttons {
  grid-area: buttons;
  display: grid;
  grid-gap: 5px;
  grid-template-columns: 1fr 1fr;
}
@media screen and (max-width: 600px) {
  .pet-buttons {
    margin-top: 10px;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
}
</style>