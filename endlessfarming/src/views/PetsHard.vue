<template>
  <v-container fluid>
    <div class="pet-container">
      <PetButtons
        :fragments-to-farm="fragmentsToFarm"
        :pets-data="petsData"
        :storage-name="'pets_hard'"
        :origin="petType"
      />
      <PetTrackers :fragments-to-farm="fragmentsToFarm" />
      <PetTable
        :edit-priorities="editPriorities"
        :knightage-level="knightageLevel"
        :fragments-to-farm="fragmentsToFarm"
        :pet-type="petType"
      />
      <footer
        class="page-footer pet-footer"
      >This priority ranking was originally created by HarroweD.</footer>
    </div>
  </v-container>
</template>

<script>
import PetTrackers from "../components/pets/petTrackers";
import PetButtons from "../components/pets/petButtons";
import PetTable from "../components/pets/petTable";

export default {
  name: "PetsHard",
  data: () => ({ petType: "shh", storageName: "pets_hard" }),
  components: { PetTable, PetTrackers, PetButtons },
  computed: {
    knightageLevel: function() {
      return this.$store.state.stats.KL;
    },
    editPriorities: function() {
      return this.$store.state.stats.edit_priorities;
    },
    petsData: {
      get() {
        return this.$store.state.pets.dataHard;
      },
      async set(value) {
        this.$store.commit("pets/setPetsData", {
          pets: value,
          storageName: "pets_hard"
        });
      }
    },
    availableTickets: function() {
      return (
        this.$store.state.stats.tickets_hard +
        3 * this.$store.state.stats.refills_hard
      );
    },
    fragmentsToFarm: function() {
      let tickets = this.availableTickets;
      let farmableFragments = [];
      for (let pet of this.petsData) {
        let fromStage = pet.stages;
        let requirements = pet.stages.map(stage => {
          return 50 + (stage - 1) * 4;
        });
        let possibleStages = requirements
          .map((req, idx) => (req <= this.knightageLevel ? fromStage[idx] : ""))
          .filter(String);
        let fragments = 0;
        let currentFrags = 0;
        for (let i = 0; i < possibleStages.length; i++) {
          currentFrags = pet.fragments;
          currentFrags = currentFrags > 330 ? 330 : currentFrags;
          if (currentFrags == 330) {
            break;
          }
          if (tickets > 0) {
            let add = 1;
            fragments += tickets >= add ? add : tickets;
            tickets -= tickets >= add ? add : tickets;
          }
        }
        tickets +=
          fragments > 330 - currentFrags ? fragments - (330 - currentFrags) : 0;
        fragments =
          fragments > 330 - currentFrags ? 330 - currentFrags : fragments;
        farmableFragments.push({
          petid: pet._id,
          farmableFragments: fragments,
          fragments: pet.fragments
        });
      }
      return farmableFragments;
    }
  },
  created: function() {
    if (!this.petsData.length) {
      this.$store.dispatch("pets/getPetsData", {
        origin: "shh",
        storageName: "pets_hard"
      });
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
  grid-template-rows: min-content minmax(min-content, 150px) 1fr min-content;
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
