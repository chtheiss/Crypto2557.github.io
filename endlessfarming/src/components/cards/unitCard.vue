<template>
  <v-sheet elevation="5" class="mx-1 my-2 unit-card">
    <UnitDialog :unit="unitJunior" />
    <UnitDialog :unit="unitSenior" :senior="true" />
    <PetDialog v-if="pet!=undefined" :pet="petPet" :unitDialog="true" />
    <v-text-field
      step="1"
      v-model="amountJr"
      class="unit-card-input unit-card-jr-input"
      dense
      hide-details
      filled
    >
      <v-icon medium dense slot="prepend" @click="downJr">mdi-minus</v-icon>
      <v-icon medium dense slot="append-outer" @click="upJr">mdi-plus</v-icon>
    </v-text-field>
    <v-text-field
      v-model="amountSr"
      step="1"
      class="unit-card-input unit-card-sr-input"
      dense
      hide-details
      filled
    >
      <v-icon medium dense slot="prepend" @click="downSr">mdi-minus</v-icon>
      <v-icon medium dense slot="append-outer" @click="upSr">mdi-plus</v-icon>
    </v-text-field>
    <div class="unit-card-buffs">
      <Buff
        v-for="buff of buffs"
        v-bind:key="buff._id"
        v-bind:buff="buff"
        v-bind:amount-jr="amountJr"
        v-bind:amount-sr="amountSr"
        v-bind:pet-active="fiveStarPet"
      />
      <Buff
        v-for="buff of additionalBuffs"
        v-bind:key="buff._id"
        v-bind:buff="buff"
        v-bind:amount-jr="amountJr"
        v-bind:amount-sr="amountSr"
        v-bind:pet-active="fiveStarPet"
        v-bind:obtainable="fiveStarPet"
      />
    </div>
  </v-sheet>
</template>

<script>
import Buff from "./buff";

export default {
  name: "UnitCard",
  components: {
    Buff,
    PetDialog: () => import("../dialogs/petDialog"),
    UnitDialog: () => import("../dialogs/unitDialog")
  },
  props: ["unitSenior", "unitJunior"],
  methods: {
    upSr() {
      this.amountSr += 1;
    },
    downSr() {
      this.amountSr -= 1;
    },
    upJr() {
      this.amountJr += 1;
    },
    downJr() {
      this.amountJr -= 1;
    }
  },
  computed: {
    petPet: function() {
      return this.$store.state.pets.data.filter(
        pet => pet._id == this.unitSenior.pet._id
      )[0];
    },
    pet: function() {
      return this.unitSenior.pet;
    },
    amountSr: {
      get() {
        return this.unitSenior.amount;
      },
      async set(value) {
        this.unitSenior.amount = parseInt(value) | 0;
        await this.$store.dispatch("units/saveValue", this.unitSenior);
      }
    },
    amountJr: {
      get() {
        return this.unitJunior.amount;
      },
      async set(value) {
        this.unitJunior.amount = parseInt(value) | 0;
        await this.$store.dispatch("units/saveValue", this.unitJunior);
      }
    },
    fiveStarPet: function() {
      return this.petPet.fragments >= 330;
    },
    additionalBuffs: function() {
      return this.pet.additionalBuffs;
    },
    buffs: function() {
      return this.unitSenior.buffs;
    }
  }
};
</script>

<style scoped>
.unit-card {
  display: grid;
  grid-template-columns: 1fr 1fr 0.5fr;
  grid-template-areas: "jr-unit sr-unit pet" "jr-input sr-input ." "buffs buffs buffs";
  grid-gap: 5px;
  padding: 2%;
}
.unit-card > * {
  justify-self: center;
  align-self: center;
}
/* Define grid areas */
.unit-card-pet {
  grid-area: pet;
}
.unit-card-jr-input {
  grid-area: jr-input;
}
.unit-card-sr-input {
  grid-area: sr-input;
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
