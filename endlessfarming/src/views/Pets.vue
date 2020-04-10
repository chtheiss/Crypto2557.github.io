<template>
  <v-container fluid>
    <div class="pet-container">
      <PetButtons />
      <PetTrackers />
      <draggable class="pet-pets" v-model="petsData" group="pets" @end="changePriority" ref="pets">
        <PetCard
          v-for="(pet, index) in petsData"
          :key="pet.id"
          v-bind:pet="pet"
          v-bind:loop-index="index"
          :knightage-level="knightageLevel"
          :farmable-fragments="fragmentsToFarm[index]"
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
import PetTrackers from "../components/pets/petTrackers";
import PetButtons from "../components/pets/petButtons";
import draggable from "vuedraggable";

export default {
  name: "Pets",
  components: { PetCard, draggable, PetTrackers, PetButtons },
  data: () => ({}),
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
    }
  },
  computed: {
    knightageLevel: function() {
      return this.$store.state.stats.KL;
    },
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
    },
    fragmentsToFarm: function() {
      let tickets = this.availableTickets;
      let farmableFragments = [];
      for (let pet of this.petsData) {
        let fromStage = pet.stages;
        let requirements = pet.stages.map(stage => {
          return Math.ceil(stage / 10) * 2;
        });
        let possibleStages = requirements
          .map((req, idx) => (req <= this.knightageLevel ? fromStage[idx] : ""))
          .filter(String);
        let fragments = 0;
        let currentFrags = 0;
        let firstPossibleStage = true;
        for (let stage of possibleStages) {
          currentFrags = pet.fragments;
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
        pet.farmableFragments = fragments;
        farmableFragments.push(fragments);
      }
      return farmableFragments;
    }
  }
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
.pet-container-other > * {
  justify-self: center;
  align-self: center;
}
.pet-nav-other {
  margin-top: 10px;
  grid-area: nav;
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
