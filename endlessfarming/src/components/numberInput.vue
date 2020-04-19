<template>
  <v-text-field v-model.number="value" step="1" class="input-number" dense hide-details filled>
    <v-icon slot="prepend" @click="down">mdi-minus</v-icon>
    <v-icon slot="append-outer" @click="up">mdi-plus</v-icon>
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
    max: {
      type: Number,
      default: Infinity
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
      get() {
        return this.$store.state.stats[this.valueName];
      },
      async set(value) {
        value = parseInt(value) | 0;
        value = value < this.min ? this.min : value;
        value = value > this.max ? this.max : value;
        let stat = { name: this.valueName, value: parseInt(value) | 0 };
        await this.$store.dispatch("stats/saveValue", stat);
      }
    }
  }
};
</script>