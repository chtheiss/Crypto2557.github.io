<template>
  <v-container fluid>
    <v-img
      contain
      src="../assets/img/meta_progression_v2.png"
      aspect-ratio="2"
    ></v-img>
    <p class="text-center credits">{{ credit }}</p>
  </v-container>
</template>

<script>
export default {
  name: "Meta",
  data: () => ({
    credit:
      "Credit goes to Yobnomekop, Weymouth, Marque, GreatGama, Akki, Cheezybob, dzed, Trav07sr20, and HarroweD. Sheet created by: CryBenihime & SxeSpanky"
  })
};
</script>
