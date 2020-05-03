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
          <p v-for="(info,index) in infos" v-bind:key="index" class="pa-0 ma-0">
            <b>{{index+1}}.</b>
            {{info}}
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
      infos: [
        "This site provides you a quick overview about which unit provides which buff and how close you are to completing each buff. Please pay attention to the difference between senior and non-senior units when entering numbers.",
        "If the current requirement differs from the maximum, the maximum requirement is shown in brackets behind it.",
        "Buffs that are locked behind a pet you don't have yet are a reddish color.",
        "Unfinished buffs are blue, and completed buffs are green. A buff only counts as completed if your total amount is higher than the maximal requirement.",
        "Hovering over a progress bar will give you details about the associated buff.",
        "The buff bars below the units will fill up as you add units.",
        "You can click the unit and pet images to get a detailed description.",
        "The information you add here is crucial to providing you with an accurate priority guide for Unit Selection Tickets found when you click on the “Tickets” tab."
      ],
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