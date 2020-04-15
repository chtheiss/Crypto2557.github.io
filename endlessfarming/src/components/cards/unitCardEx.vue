<template>
  <v-container class="unit-card bordered">
    <UnitDialog :unit="unit" :extreme="true" />
    <PetDialog v-if="pet!=undefined" :pet="pet" :unitDialog="true" />
    <v-text-field
      v-model="amount"
      step="1"
      class="unit-card-input unit-card-input"
      dense
      hide-details
      filled
    >
      <v-icon medium dense slot="prepend" color="#fff" @click="down">mdi-minus</v-icon>
      <v-icon medium dense slot="append-outer" color="#fff" @click="up">mdi-plus</v-icon>
    </v-text-field>
    <div class="unit-card-buffs">
      <Buff v-for="buff in unit.buffs" v-bind:key="buff._id" v-bind:buff="buff" />
    </div>
  </v-container>
</template>

<script>
import Buff from "./buff";

export default {
  name: "UnitCardEx",
  props: ["unit"],
  components: {
    Buff,
    PetDialog: () => import("../dialogs/petDialog"),
    UnitDialog: () => import("../dialogs/unitDialog")
  },
  methods: {
    up() {
      this.amount += 1;
    },
    down() {
      this.amount -= 1;
    }
  },
  computed: {
    pet: function() {
      return this.$store.state.pets.data.filter(
        pet => pet._id == this.unit.pet._id
      )[0];
    },
    amount: {
      get() {
        return this.unit.amount;
      },
      async set(value) {
        this.unit.amount = value;
        await this.$store.dispatch("units/saveValue", this.unit);
      }
    }
  }
};
</script>

<style scoped>
.pet-image,
.unit-image {
  max-height: 45px;
}
.input-number.pet-card-input .v-input__slot,
.input-number.pet-card-input .v-input__control {
  min-height: 30px !important;
}
.unit-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "unit pet"
    "input ."
    "buffs buffs";
  grid-gap: 5px;
  padding: 2%;
}
/* Define changes for mobile ex unit card grid */
@media screen and (max-width: 600px) {
  .unit-card {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas:
      "unit unit pet"
      "input input ."
      "buffs buffs buffs";
  }
}
.unit-card > * {
  justify-self: center;
  align-self: center;
}
.unit-card-ex-unit {
  grid-area: unit;
  outline: 2px solid #f70294;
  background: radial-gradient(circle, #333 0, #333 0, rgba(247, 2, 148, 0.3));
}
.unit-card-pet {
  grid-area: pet;
}
.unit-card-input {
  grid-area: input;
}
.unit-card-buffs {
  grid-area: buffs;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 3px;
  justify-self: normal;
  justify-content: center;
  align-content: center;
}
</style>
