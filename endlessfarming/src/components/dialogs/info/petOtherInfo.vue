<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-container fluid class="ma-0 pa-0 d-flex justify-end">
          <v-btn icon v-on="on">
            <v-icon>fas fa-question</v-icon>
          </v-btn>
        </v-container>
      </template>

      <v-card color="background">
        <v-card-title class="headline" primary-title><span class="header-font-size">Info</span></v-card-title>
        <v-card-text class="white--text">
          <p class="pa-0 ma-0">
            <b>1.</b> This site provides a information about all pets not obtainable in Spirit Highland Normal or Hard.
          </p>
          <p class="pa-0 ma-0">
            <b>2.</b> Pets are sorted by priority from left to right and top to bottom except for Raid and Outland.
          </p>
          <p class="pa-0 ma-0">
            <b>3.</b> You can click the pet images to get additional information about each pet.
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "PetOtherInfo",
  data() {
    return {
      dialog: false
    };
  }
};
</script>

<style scoped>
p {
  font-size: 16px;
}
</style>