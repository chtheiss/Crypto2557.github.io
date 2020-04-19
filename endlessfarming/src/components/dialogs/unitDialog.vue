<template>
  <v-dialog v-model="dialog" width="650px">
    <template v-slot:activator="{ on }">
      <img
        v-on="on"
        class="unit-image"
        :src="require(`../../assets/img/units/${unit._id}.png`)"
        aspect-ratio="1"
        v-bind:class="classObject"
      />
    </template>
    <v-card color="background">
      <v-card-title>
        <h5 class="modal-title">{{unit.name}}</h5>
        <img
          class="unit-image ml-2"
          :src="require(`../../assets/img/units/${unit._id}.png`)"
          aspect-ratio="1"
        />
        <v-spacer></v-spacer>
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="white--text">
        <ul>
          <li v-for="(ability, index) in unit.abilities" :key="index">{{ability}}</li>
        </ul>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "UnitDialog",
  props: {
    unit: Object,
    senior: {
      type: Boolean,
      default: false
    },
    extreme: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false
    };
  },
  computed: {
    classObject: function() {
      return {
        "unit-card-jr-unit": !this.senior & !this.extreme,
        "unit-card-sr-unit": this.senior,
        "unit-card-ex-unit": this.extreme
      };
    }
  }
};
</script>

<style scoped>
.unit-image {
  max-height: 45px;
}
.unit-card-jr-unit {
  grid-area: jr-unit;
  outline: 2px solid #ac081d;
  background: radial-gradient(circle, #333 0, #333 0, rgba(172, 8, 29, 0.3));
  cursor: pointer;
  justify-self: center;
  align-self: center;
}
.unit-card-sr-unit {
  grid-area: sr-unit;
  outline: 2px solid #bca45a;
  background: radial-gradient(circle, #333 0, #333 0, rgba(188, 164, 90, 0.3));
  cursor: pointer;
  justify-self: center;
  align-self: center;
}
.unit-card-ex-unit {
  grid-area: unit;
  outline: 2px solid #f70294;
  background: radial-gradient(circle, #333 0, #333 0, rgba(247, 2, 148, 0.3));
  cursor: pointer;
  justify-self: center;
  align-self: center;
}
</style>
