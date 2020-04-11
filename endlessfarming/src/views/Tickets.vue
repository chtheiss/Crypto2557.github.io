<template>
  <v-container fluid>
    <TicketRow v-for="ticket in tickets" v-bind:key="ticket._id" v-bind:ticket="ticket" />
  </v-container>
</template>

<script>
export default {
  name: "Tickets",
  components: { TicketRow: () => import("../components/ticketRow") },
  computed: {
    tickets: function() {
      return this.$store.state.units.tickets;
    }
  },
  mounted: function() {
    if (!this.$store.state.units.data.length) {
      this.$store.dispatch("units/getUnitsData");
    }
    if (!this.$store.state.units.tickets.length) {
      this.$store.dispatch("units/getTickets");
    }
  }
};
</script>

<style scoped>
</style>
