<template>
  <v-container fluid>
    <v-container>
      <v-btn icon class="d-flex justify-end">
        <v-icon>fas fa-question</v-icon>
      </v-btn>
    </v-container>
    <v-tabs v-model="tab" :color="'#fff'" dark center-active show-arrows centered>
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-for="name in tabs" :key="name" :href="`#tab-${name}`">{{ name }}</v-tab>
      <v-tab-item v-for="(name, index) in tabs" :key="name" :value="'tab-' + name">
        <keep-alive>
          <v-card flat tile :style="{'background': '#26292f'}">
            <UnitTable v-bind:tribe="3-index" />
          </v-card>
        </keep-alive>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
export default {
  name: "Units",
  components: { UnitTable: () => import("../components/units/unitTable") },
  data: () => ({
    tab: null,
    tabs: ["Orc", "Undead", "Elf", "Human"]
  }),
  computed: {
    unitsData: {
      get() {
        return this.$store.state.units.data;
      },
      async set(value) {
        this.$store.commit("units/setUnitsData", value);
      }
    }
  },
  mounted: function() {
    if (!this.$store.state.units.data.length) {
      this.$store.dispatch("units/getUnitsData");
    }
    if (!this.$store.state.pets.data.length) {
      this.$store.dispatch("pets/getPetsData", {
        origin: "shn",
        storageName: "pets"
      });
    }
  }
};
</script>

<style scoped>
</style>
