<template>
  <v-container fluid>
    <v-tabs v-model="tab" :color="'#fff'" dark grow>
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-for="name in tabs" :key="name" :href="`#tab-${name}`">{{ name }}</v-tab>
      <v-tab-item v-for="(name, index) in tabs" :key="name" :value="'tab-' + name" grow>
        <keep-alive>
          <v-card flat tile>
            <PetTable
              :edit-priorities="0"
              :knightage-level="0"
              :fragments-to-farm="undefined"
              :pet-type="petTypes[index]"
            />
          </v-card>
        </keep-alive>
      </v-tab-item>
    </v-tabs>
    <footer class="text-center">These priority ranking were originally created by HarroweD.</footer>
  </v-container>
</template>

<script>
export default {
  name: "PetsOther",
  data: () => ({
    petTypes: [
      "ss1",
      "ss2",
      "ss3",
      "ss4",
      "ss5",
      "greek",
      "zodiac",
      "event",
      "raid",
      "ob"
    ],
    storageNames: ["pets_hard", "pets_other"],
    tab: null,
    tabs: [
      "Secret Shop 1",
      "Secret Shop 2",
      "Secret Shop 3",
      "Secret Shop 4",
      "Secret Shop 5",
      "Greek",
      "Zodiac",
      "Event",
      "Raid",
      "Outland"
    ]
  }),
  components: { PetTable: () => import("../components/pets/petTable") },
  created: function() {
    if (!this.$store.state.pets.dataOther.length) {
      this.$store.dispatch("pets/getOtherPetsData", this.petTypes);
    }
  }
};
</script>
      

<style scoped>
.pet-pets {
  grid-area: pets;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  justify-content: center;
  align-content: center;
  background: #26292f;
}
@media screen and (max-width: 630px) {
  .pet-pets {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media screen and (min-width: 630px) {
  .pet-pets {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media screen and (min-width: 830px) {
  .pet-pets {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media screen and (min-width: 1040px) {
  .pet-pets {
    grid-template-columns: repeat(5, 1fr);
  }
}
@media screen and (min-width: 1250px) {
  .pet-pets {
    grid-template-columns: repeat(6, 1fr);
  }
}
@media screen and (min-width: 1460px) {
  .pet-pets {
    grid-template-columns: repeat(7, 1fr);
  }
}
@media screen and (min-width: 1670px) {
  .pet-pets {
    grid-template-columns: repeat(8, 1fr);
  }
}
@media screen and (min-width: 1880px) {
  .pet-pets {
    grid-template-columns: repeat(9, 1fr);
  }
}
</style>
