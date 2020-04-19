<template>
  <v-tooltip top max-width="250px" color="primary" class="black--text">
    <template v-slot:activator="{ on }">
      <v-progress-linear height="25" rounded :color="color" v-on="on" :value="percentage">
        <strong v-if="maxRequirement==currentRequirement">{{total}}/{{currentRequirement}}</strong>
        <strong v-else>{{total}}/{{currentRequirement}} ({{maxRequirement}})</strong>
      </v-progress-linear>
    </template>
    <h4 class="black--text">{{buff.name}}</h4>
    <v-divider color="secondary"></v-divider>
    <span
      class="black--text"
      v-if="petActive & buff.descriptionForPet!=undefined"
    >{{buff.descriptionForPet}}</span>
    <span class="black--text" v-else>{{buff.description}}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: "Buff",
  props: {
    buff: Object,
    amountJr: {
      type: Number,
      default: 0
    },
    amountSr: {
      type: Number,
      default: 0
    },
    petActive: {
      type: Boolean
    },
    obtainable: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    linkedPets: function() {
      if (this.buff.linkedPets == undefined) {
        return [];
      }
      return this.$store.state.pets.data.filter(pet =>
        this.buff.linkedPets.includes(pet._id)
      );
    },
    linkedFiveStarUnits: function() {
      if (this.buff.linkedUnits == undefined) {
        return [];
      }
      return this.$store.state.units.data.filter(unit =>
        this.buff.linkedUnits.includes(unit._id)
      );
    },
    linkedSixStarUnits: function() {
      if (this.buff.linkedUnits == undefined) {
        return [];
      }
      return this.$store.state.units.data.filter(unit =>
        this.buff.linkedUnits.includes(unit._id - 1)
      );
    },
    currentRequirement: function() {
      return this.buff.requirement[
        this.petActive +
          this.linkedPets.filter(pet => pet.fragments >= 330).length
      ];
    },
    total: function() {
      let linkedFiveStarAmount = 0;
      let linkedSixStarAmount = 0;
      for (let i = 0; i < this.linkedFiveStarUnits.length; i++) {
        linkedFiveStarAmount +=
          this.linkedFiveStarUnits[i].amount * this.buff.linkedMultiplier[i];
        linkedSixStarAmount +=
          this.linkedSixStarUnits[i].amount * this.buff.linkedMultiplier[i];
      }
      let total =
        this.amountJr * this.buff.multiplier +
        this.amountSr +
        this.buff.multiplier * linkedFiveStarAmount +
        linkedSixStarAmount;
      total = Number.isInteger(total) ? total : total.toFixed(2);
      return total;
    },
    percentage: function() {
      return 100 * (this.total / this.currentRequirement);
    },
    maxRequirement: function() {
      return this.buff.requirement[this.buff.requirement.length - 1];
    },
    color: function() {
      if (!this.obtainable) {
        return "error";
      }
      return this.total < this.maxRequirement ? "info" : "success";
    }
  }
};
</script>