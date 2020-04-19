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
        <v-card-title class="headline" primary-title>Info</v-card-title>
        <v-card-text class="white--text">
          <p class="pa-0 ma-0">
            <b>1.</b> This site provides you a quick overview about which unit provides which buff
            and how close you are to completing each buff.
            Please pay attention to the difference between senior and non-senior units when entering numbers.
          </p>
          <p class="pa-0 ma-0">
            <b>2.</b> You can click the unit and pet images to get a detailed description.
          </p>
          <p class="pa-0 ma-0">
            <b>3.</b> Hovering over a progress bar will give you details about the associated buff.
          </p>
          <p class="pa-0 ma-0">
            <b>4.</b> The buff bars below the units will fill up as you add units.
          </p>
          <p class="pa-0 ma-0">
            <b>5.</b> The information you add here is crucial to providing you with an accurate priority guide for Unit Selection Tickets found when you click on the “Tickets” tab.
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "UnitInfo",
  data() {
    return {
      dialog: false
    };
  }
};
</script>