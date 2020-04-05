<template>
    <v-text-field
      v-model.number="value"
      step="1"
      class="input-number"
      dense
      hide-details
      filled
    >
      <v-icon slot="prepend" color="#fff" @click="down">mdi-minus</v-icon>
      <v-icon slot="append-outer" color="#fff" @click="up">mdi-plus</v-icon>
    </v-text-field>
</template>

<script>
export default {
  name: "NumberInput",
  props: {
    min: {
      type: Number,
      default: 0
    },
    valueName: String
  },
  methods: {
    up() {
      this.value += 1;
    },
    down() {
      this.value -= 1;
    }
  },
  computed: {
  value: {
    get () {
      return this.$store.state.stats[this.valueName]
    },
    async set (value) {
       let stat ={name:this.valueName, value:value}
       await this.$store.dispatch("stats/saveStat", stat);
    }
  }
  }
};
</script>

<style scoped>
</style>