<template>
  <draggable
    class="pet-pets mt-4"
    v-model="petsData"
    @end="changePriority"
    :disabled="!editPriorities"
  >
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <PetCard
      v-for="(pet, index) in petsData"
      :key="pet.id"
      v-bind:pet="pet"
      v-bind:loop-index="index"
      :knightage-level="knightageLevel"
      :farmable-fragments="fragmentsToFarm!=undefined ? fragmentsToFarm[index].farmableFragments : -1"
      :pet-type="petType"
      :edit-priorities="editPriorities"
    ></PetCard>
  </draggable>
</template>

<script>
export default {
  name: "PetTable",
  data: () => ({ overlay: false }),
  props: {
    editPriorities: Number,
    knightageLevel: Number,
    fragmentsToFarm: Array,
    petType: {
      type: String,
      default: "shn"
    }
  },
  components: {
    draggable: () => import("vuedraggable"),
    PetCard: () => import("../cards/petCard")
  },
  methods: {
    changePriority: async function(evt) {
      this.overlay = true;
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
      this.overlay = false;
    }
  },
  computed: {
    petsData: {
      get() {
        if (this.petType == "shn") {
          return this.$store.state.pets.data;
        } else if (this.petType == "shh") {
          return this.$store.state.pets.dataHard;
        } else {
          return this.$store.state.pets.dataOther.filter(pet =>
            pet.origin.includes(this.petType)
          );
        }
      },
      async set(value) {
        let storageName;
        if (this.petType == "shn") {
          storageName = "pets";
        } else if (this.petType == "shh") {
          storageName = "pets_hard";
        } else {
          storageName = "pets_other";
        }
        this.$store.commit("pets/setPetsData", {
          pets: value,
          storageName: storageName
        });
      }
    }
  }
};
</script>