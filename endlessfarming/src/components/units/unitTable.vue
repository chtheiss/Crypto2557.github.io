<template>
  <v-container class="unit-container">
    <UnitCardEx
      v-for="(unit, index) in sevenStarUnits"
      :key="unit.id"
      v-bind:unit="unit"
      v-bind:loop-index="index"
    ></UnitCardEx>
    <UnitCard
      v-for="(unit, index) in sixStarUnits"
      :key="unit.id"
      v-bind:unit-senior="unit"
      v-bind:unit-junior="fiveStarUnits[index]"
      v-bind:loop-index="index"
    ></UnitCard>
  </v-container>
</template>

<script>
export default {
  name: "UnitTable",
  props: ["tribe"],
  components: {
    UnitCard: () => import("../cards/unitCard"),
    UnitCardEx: () => import("../cards/unitCardEx")
  },
  computed: {
    units: function() {
      return this.$store.state.units.data
        .filter(
          unit =>
            (unit.tribe == this.tribe) &
            (((unit.stars == 5) & (unit.evolveGem == 2800)) | (unit.stars >= 6))
        )
        .sort(function(a, b) {
          if (a._id < b._id) return 1;
          if (a._id > b._id) return -1;
          return 0;
        });
    },
    fiveStarUnits: function() {
      return this.units.filter(unit => unit.stars == 5);
    },
    sixStarUnits: function() {
      return this.units.filter(unit => unit.stars == 6);
    },
    sevenStarUnits: function() {
      return this.units.filter(unit => unit.stars == 7);
    }
  }
};
</script>
<style scoped>
.unit-container {
  display: grid;
  width: 90%;
  grid-gap: 5px;
  grid-template-columns: repeat(4, 1fr);
  justify-content: center;
  align-content: center;
  margin-top: 10px;
}
/* Define changes for mobile grid */
@media screen and (max-width: 1000px) {
  .unit-container {
    grid-template-columns: repeat(2, 1fr);
    width: 80%;
  }
}
@media screen and (max-width: 600px) {
  .unit-container {
    grid-template-columns: repeat(1, 1fr);
    width: 80%;
  }
}
</style>