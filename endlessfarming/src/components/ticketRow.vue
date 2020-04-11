<template>
  <v-container class="ticket-row">
    <v-row class="my-1">
      <img class="unit-image mx-2" :src="require(`../assets/img/units/${ticket.unit._id}.png`)" />
      <h2 class="d-flex align-center">{{ticket.unit.name}}</h2>
    </v-row>
    <v-row>
      <v-progress-linear :value="completeness" height="25" rounded :color="color">
        <strong>{{units}}/{{requirement}}</strong>
      </v-progress-linear>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "TicketRow",
  props: { ticket: Object },
  computed: {
    units: function() {
      return this.$store.state.units.data
        .filter(unit => unit.name == this.ticket.unit.name)
        .map(unit => unit.amount)
        .reduce((a, b) => a + b, 0);
    },
    requirement: function() {
      return this.ticket.requirement;
    },
    completeness: function() {
      return (this.units / this.requirement) * 100;
    },
    color: function() {
      if (this.completeness >= 100) {
        return "#1ca51c";
      }
      return "#29abe2";
    }
  }
};
</script>

<style scoped>
.unit-image {
  max-height: 45px;
}
.ticket-row {
  width: 80%;
}
</style>
