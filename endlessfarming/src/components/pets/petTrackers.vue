<template>
  <div class="pet-trackers">
    <div class="pet-tracker" data-empty="True" v-for="(tracker,index) in trackers" :key="index">
      <img class="pet-image" :src="require(`../../assets/img/pets/${tracker.petid}.png`)" />
      <p>{{tracker.days}} days</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "PetTrackers",
  computed: {
    petsData: function() {
      return this.$store.state.pets.data;
    },
    trackers: function() {
      let trackers = [];
      for (let pet of this.petsData.filter(pet => pet.farmableFragments > 0)) {
        trackers.push({
          petid: pet._id,
          days: Math.ceil((330 - pet.fragments) / pet.farmableFragments)
        });
      }
      return trackers;
    }
  }
};
</script>

<style scoped>
.pet-trackers {
  grid-area: trackers;
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(6, minmax(min-content, 1fr));
}
@media screen and (max-width: 600px) {
  .pet-trackers {
    grid-template-columns: repeat(4, minmax(min-content, 1fr));
  }
}
.pet-image {
  max-height: 45px;
}
@media all and (max-width: 768px) {
  .pet-image {
    max-height: 40px;
  }
}
.pet-tracker {
  justify-self: center;
  align-self: center;
}
.pet-tracker > p {
  text-align: center;
}
</style>