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
        <v-card-title class="headline" primary-title><span class="headlines">Info</span></v-card-title>
        <v-card-text class="white--text">
          <p class="pa-0 ma-0">
            <b>1.</b> On this page you can find suggestions in which order you should use your valuable Unit Selection Tickets.
          </p>
          <p class="pa-0 ma-0">
            <b>2.</b> You can use this list as a general guideline. However, if you want to get the most out of it you can
            click on the “Units” tab. and enter all relevant unit data if you haven't done so yet. That way we can provide you with
            the most accurate priority guide.
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "TicketInfo",
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