<template>
  <v-container class="unit-card bordered">
    <UnitDialog :unit="unitJunior" />
    <UnitDialog :unit="unitSenior" :senior="true" />
    <PetDialog :pet="pet" :unitDialog="true" />
    <v-text-field
      step="1"
      v-model="amountJr"
      class="unit-card-input unit-card-jr-input"
      dense
      hide-details
      filled
    >
      <v-icon medium dense slot="prepend" color="#fff" @click="downJr">mdi-minus</v-icon>
      <v-icon medium dense slot="append-outer" color="#fff" @click="upJr">mdi-plus</v-icon>
    </v-text-field>
    <v-text-field
      v-model="amountSr"
      step="1"
      class="unit-card-input unit-card-sr-input"
      dense
      hide-details
      filled
    >
      <v-icon medium dense slot="prepend" color="#fff" @click="downSr">mdi-minus</v-icon>
      <v-icon medium dense slot="append-outer" color="#fff" @click="upSr">mdi-plus</v-icon>
    </v-text-field>
    <div class="unit-card-buffs">
      <v-progress-linear
        v-for="buff in unitSenior.buffs"
        v-bind:key="buff._id"
        height="25"
        rounded
        color="#29abe2"
      >
        <strong>{{0}}/{{10}}</strong>
      </v-progress-linear>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "UnitCard",
  components: {
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
    pet: function() {
      return this.$store.state.pets.data.filter(
        pet => pet._id == this.unitSenior.pet._id
      )[0];
    },
    amountSr: {
      get() {
        return this.unitSenior.amount;
      },
      async set(value) {
        this.unitSenior.amount = value;
        await this.$store.dispatch("units/saveValue", this.unitSenior);
      }
    },
    amountJr: {
      get() {
        return this.unitJunior.amount;
      },
      async set(value) {
        this.unitJunior.amount = value;
        await this.$store.dispatch("units/saveValue", this.unitJunior);
      }
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
