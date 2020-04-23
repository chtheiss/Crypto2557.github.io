<template>
  <div class="pet-buttons">
    <v-btn
      light
      id="reset-btn"
      color="primary"
      class="black--text"
      v-on:click="resetPriority"
    >Reset Priority</v-btn>
    <v-btn
      light
      id="add-all-btn"
      color="primary"
      class="black--text"
      v-on:click="progressOneDay"
    >Progress 1 Day</v-btn>
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";

export default {
  name: "PetButtons",
  props: {
    fragmentsToFarm: Array,
    petsData: Array,
    storageName: {
      type: String,
      default: "pets"
    },
    origin: {
      type: String,
      default: "shn"
    }
  },
  methods: {
    resetPriority: async function() {
      this.$emit("start-change-prio", true);
      let originalPetsData = await axios.get(
        `https://endless-farming-backend.herokuapp.com/api/v1/priority/${this.origin}`
      );
      let originalPets = originalPetsData.data.data[0].pets;
      let pets = this.petsData;
      var mergedList = _.map(originalPets, function(item) {
        return _.extend(item, _.find(pets, { name: item.name }));
      });
      for (let i = 0; i < mergedList.length; i++) {
        mergedList[i].priority = i;
      }
      this.$store.commit("pets/setPetsData", {
        pets: mergedList,
        storageName: this.storageName
      });
      for (const pet of mergedList) {
        await this.$store.dispatch("pets/saveValue", pet);
      }
      this.$emit("end-change-prio", false);
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