<template>
  <v-container fluid>
    <div class="pet-container">
      <div class="pet-buttons">
        <v-btn light id="reset-btn" v-on:click="resetPriority">Reset Priority</v-btn>
        <v-btn light id="add-all-btn" v-on:click="progressOneDay">Progress 1 Day</v-btn>
      </div>
      <div class="pet-trackers">
        <div class="pet-tracker" data-empty="True" v-for="(tracker,index) in trackers" :key="index">
          <img class="pet-image" :src="require(`../assets/img/pets/${tracker.petid}.png`)" />
          <p>{{tracker.days}} days</p>
        </div>
      </div>
      <draggable class="pet-pets" v-model="petsData" group="pets" @end="changePriority" ref="pets">
        <PetCard
          v-for="(pet, index) in petsData"
          :key="pet.id"
          v-bind:pet="pet"
          v-bind:loop-index="index"
          @fragments-change="handleFragmentsChange"
        ></PetCard>
      </draggable>
      <footer
        class="page-footer pet-footer"
      >This priority ranking was originally created by HarroweD.</footer>
    </div>
  </v-container>
</template>

<script>
import PetCard from "../components/cards/petCard";
import draggable from "vuedraggable";
import axios from "axios";
import _ from "lodash";

String.prototype.replaceAll = function(search, replacement) {
  let target = this;
  return target.replace(new RegExp(search, "g"), replacement);
};

export default {
  name: "Pets",
  components: { PetCard, draggable },
  data: () => ({
    number_of_trackers: 12,
    trackers: []
  }),
  methods: {
    changePriority: async function(evt) {
      let change = this.petsData.filter(pet => {
        let prio = pet.priority;
        if (evt.newIndex < evt.oldIndex) {
          return prio >= evt.newIndex && prio <= evt.oldIndex;
        } else {
          return prio >= evt.oldIndex && prio <= evt.newIndex;
        }
      });
      for (let pet of change) {
        if (pet.priority == evt.oldIndex) {
          pet.priority = evt.newIndex;
        } else {
          if (evt.newIndex < evt.oldIndex) {
            pet.priority += 1;
          } else {
            pet.priority -= 1;
          }
        }
        await this.$store.dispatch("pets/saveValue", pet);
      }
    },
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
    calculateFragmentsToFarm: function() {
      let tickets = this.availableTickets;
      for (let petComponent of this.$refs.pets.$children) {
        let fromStage = petComponent.pet.stages;
        let possibleStages = petComponent.klRequirement
          .map((req, idx) =>
            req <= petComponent.knightageLevel ? fromStage[idx] : ""
          )
          .filter(String);
        let fragments = 0;
        let currentFrags = 0;
        let firstPossibleStage = true;
        for (let stage of possibleStages) {
          currentFrags = petComponent.fragments;
          currentFrags = currentFrags > 330 ? 330 : currentFrags;
          if (currentFrags == 330) {
            break;
          }
          if (tickets > 0) {
            let add = 3;
            if (stage >= 396 && stage % 5 != 0) {
              add = 1;
              firstPossibleStage = false;
            } else if (firstPossibleStage) {
              add = 6;
              firstPossibleStage = false;
            }
            fragments += tickets >= add ? add : tickets;
            tickets -= tickets >= add ? add : tickets;
          }
        }
        tickets +=
          fragments > 330 - currentFrags ? fragments - (330 - currentFrags) : 0;
        fragments =
          fragments > 330 - currentFrags ? 330 - currentFrags : fragments;
        petComponent.farmableFragments = fragments;
      }
    },
    progressOneDay: function() {
      for (let petComponent of this.$refs.pets.$children.filter(
        pet => pet.farmableFragments > 0
      )) {
        petComponent.fragments += petComponent.farmableFragments;
      }
    },
    updateTrackers: function() {
      let trackers = [];
      for (let petComponent of this.$refs.pets.$children.filter(
        pet => pet.farmableFragments > 0
      )) {
        trackers.push({
          petid: petComponent.pet._id,
          days: Math.ceil(
            (330 - petComponent.fragments) / petComponent.farmableFragments
          )
        });
      }
      this.trackers = trackers;
    },
    handleFragmentsChange: function() {
      this.calculateFragmentsToFarm();
      this.updateTrackers();
    }
  },
  watch: {
    availableTickets: function() {
      this.calculateFragmentsToFarm();
      this.updateTrackers();
    }
  },
  computed: {
    petsData: {
      get() {
        return this.$store.state.pets.data;
      },
      async set(value) {
        this.$store.commit("pets/setPetsData", value);
      }
    },
    availableTickets: function() {
      return (
        this.$store.state.stats.tickets + 5 * this.$store.state.stats.refills
      );
    }
  },
  mounted: function() {
    this.calculateFragmentsToFarm();
    this.updateTrackers();
  },
  updated: function() {}
};
</script>
      

<style scoped>
.pet-container {
  display: grid;
  width: 90%;
  grid-gap: 5px;
  grid-template-columns: 1fr;
  grid-template-rows: 50px minmax(min-content, 150px) 1fr 12px;
  grid-template-areas: "buttons" "trackers" "pets" "footer";
  justify-content: center;
  align-content: center;
  margin: auto;
}
@media screen and (max-width: 600px) {
  .pet-container {
    width: 70%;
  }
}
.pet-container-other {
  display: grid;
  width: 80%;
  grid-gap: 5px;
  grid-template-columns: 1fr;
  grid-template-rows: minmax(min-content, 150px) 1fr 12px;
  grid-template-areas: "nav" "pets" "footer";
  justify-content: center;
  align-content: center;
  margin: auto;
}

.pet-container > *,
.pet-tracker,
.pet-container-other > * {
  justify-self: center;
  align-self: center;
}
.pet-tracker {
  display: grid;
}
.pet-tracker > * {
  justify-self: center;
}
.pet-tracker > p {
  text-align: center;
}
.pet-nav-other {
  margin-top: 10px;
  grid-area: nav;
}

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
.pet-trackers {
  grid-area: trackers;
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(6, minmax(min-content, 1fr));
}
@media screen and (max-width: 600px) {
  .pet-trackers {
    grid-template-columns: repeat(4, minmax(min-content, 1fr));
  }
}
.pet-pets {
  grid-area: pets;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  justify-content: center;
  align-content: center;
}
@media screen and (max-width: 830px) {
  .pet-pets {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media screen and (min-width: 830px) {
  .pet-pets {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media screen and (min-width: 1040px) {
  .pet-pets {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media screen and (min-width: 1250px) {
  .pet-pets {
    grid-template-columns: repeat(5, 1fr);
  }
}
@media screen and (min-width: 1460px) {
  .pet-pets {
    grid-template-columns: repeat(6, 1fr);
  }
}
@media screen and (min-width: 1670px) {
  .pet-pets {
    grid-template-columns: repeat(7, 1fr);
  }
}
@media screen and (min-width: 1880px) {
  .pet-pets {
    grid-template-columns: repeat(8, 1fr);
  }
}
</style>
