<template>
  <v-tooltip top max-width="250px" class="white--text" color="#272727">
    <template v-slot:activator="{ on }">
      <v-progress-linear height="25" rounded color="#29abe2" v-on="on">
        <strong>{{buff.multiplier}}</strong>
      </v-progress-linear>
    </template>
    <h4>{{buff.name}}</h4>
    <v-divider></v-divider>
    <span>{{buff.description}}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: "Buff",
  props: ["buff"]
};
</script>