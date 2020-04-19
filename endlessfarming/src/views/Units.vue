<template>
  <v-container fluid>
    <UnitInfo />
    <v-tabs v-model="tab" center-active show-arrows centered>
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-for="name in tabs" :key="name" :href="`#tab-${name}`">{{ name }}</v-tab>
      <v-tab-item v-for="(name, index) in tabs" :key="name" :value="'tab-' + name">
        <keep-alive>
          <v-card flat tile color="background">
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
  components: {
    UnitTable: () => import("../components/units/unitTable"),
    UnitInfo: () => import("../components/dialogs/info/unitInfo")
  },
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
