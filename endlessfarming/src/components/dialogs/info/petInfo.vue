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
            <b>1.</b> This site provides a priority system for farming Spirit Highlands (SH) pets that will maximize growth based on your current Knightage Level (KL) and available tickets.Provide a priority system for farming Spirit Highlands (SH) pets
            that will maximize growth based on your current Knightage Level (KL) and available tickets.
          </p>
          <p class="pa-0 ma-0">
            <b>2.</b> Pets are sorted by priority from left to right and top to bottom. If you disagree with the ranking you can change
            it by enabling the "Editing Pet Priorities" option under settings and drag and drop them as you see fit. If you want to get back to the
            most recent ranking provided by us just click the "Reset Priority" button at the top.
          </p>
          <p class="pa-0 ma-0">
            <b>3.</b> Click the cogwheel at the top right of the page and enter your Knightage Level and the relevant data under the “Pets” tab.
            You should update this information every time your anything changes.
          </p>
          <p class="pa-0 ma-0">
            <b>4.</b> You will see the pet farming suggestions across the top of the page along with the number of days until completion.
            You will also see big green numbers appear on the pet cards showing how many tickets should be spent per day on that pet.
          </p>
          <p class="pa-0 ma-0">
            <b>5.</b> Numbers on the bottom of the pet card indicate what KL is needed to access fragments of that pet.
            If they are highlighted green then you are eligible to farm these fragments.
          </p>
          <p class="pa-0 ma-0">
            <b>6.</b> You can click the pet images to get additional information about each pet.
          </p>
          <p class="pa-0 ma-0">
            <b>7.</b> You can do simple math in the input fields by ending your input with a dot.
            For example if you type "80+10." the resulting fragments will be 90.
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "PetInfo",
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