<template>
  <v-dialog v-model="dialog" width="650px">
    <template v-slot:activator="{ on }" v-bind:pet="pet">
      <img
        v-if="!unitDialog"
        v-on="on"
        v-bind:id="`${pet._id}-image`"
        class="pet-image pet-card-pet"
        :src="require(`../../assets/img/pets/${pet._id}.png`)"
        aspect-ratio="1"
        v-bind:class="activeBackgroundClass"
      />
      <img
        v-else
        v-on="on"
        v-bind:id="`${pet._id}-image`"
        class="pet-image unit-card-pet"
        :src="require(`../../assets/img/pets/${pet._id}.png`)"
        aspect-ratio="1"
        v-bind:class="{'five-star-pet': pet.fragments >=330}"
      />
    </template>
    <v-card>
      <v-card-title>
        <h5 class="modal-title">{{pet.name}}</h5>
        <img
          class="pet-image ml-2"
          :src="require(`../../assets/img/pets/${pet._id}.png`)"
          aspect-ratio="1"
        />
        <v-spacer></v-spacer>
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="modal-content">
        <v-container fluid>
          <v-row>
            <v-col cols="12" class="px-2 py-1">Skill 1: {{pet.skill1}}</v-col>
            <v-col cols="12" class="px-2 py-1">Skill 2: {{pet.skill2}}</v-col>
            <v-col cols="12" v-if="pet.artifact" class="d-flex align-center px-2 py-1">
              Skill 3: {{pet.skill3}} [
              <img
                class="unit-image mx-2"
                :src="require(`../../assets/img/artifacts/${pet.artifact._id}.png`)"
              />
              {{pet.artifact.name}} ]
            </v-col>
            <v-col cols="12" v-else-if="pet.couple" class="d-flex align-center px-2 py-1">
              Skill 3: {{pet.skill3.split("[")[0]}} [
              <img
                class="unit-image mx-2"
                :src="require(`../../assets/img/units/${pet.couple}.png`)"
              />
              {{pet.skill3.split("[")[1]}}
            </v-col>
            <v-col cols="12" v-else-if="pet.origin.includes('ob')" class="px-2 py-1">
              Skill 3:
              <ul>
                <li v-for="(skill, index) in obSkills" :key="index">{{skill}}</li>
              </ul>
            </v-col>
            <v-col cols="12" class="px-2 py-1" v-else>Skill 3: {{pet.skill3}}</v-col>
            <v-col cols="12" v-if="pet.hidden_abilities" class="px-2 py-1">
              <ul>
                <li v-for="(ability, index) in pet.hidden_abilities" :key="index">{{ability}}</li>
              </ul>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    pet: Object,
    starThresholds: { type: Array, default: () => [] },
    fragments: { type: Number, default: 0 },
    unitDialog: {
      type: Boolean,
      default: false
    }
  },
  name: "PetDialog",
  data() {
    return {
      dialog: false
    };
  },
  computed: {
    obSkills: function() {
      return this.pet.skill3.split("-").slice(1);
    },
    activeBackgroundClass: function() {
      let trueIndex = this.starThresholds
        .map(threshold => {
          return this.fragments >= threshold;
        })
        .lastIndexOf(true);
      return {
        "zero-star": trueIndex == -1,
        "one-star": trueIndex == 0,
        "two-star": trueIndex == 1,
        "three-star": trueIndex == 2,
        "four-star": trueIndex == 3,
        "five-star": trueIndex == 4
      };
    }
  }
};
</script>

<style scoped>
.pet-image,
.unit-image {
  max-height: 45px;
}
.five-star-pet {
  filter: drop-shadow(#1ca51c 1px 1px 10px);
}
.unit-card-pet {
  grid-area: pet;
  justify-self: center;
  align-self: center;
  cursor: pointer;
}
@media all and (max-width: 768px) {
  .pet-image,
  .unit-image {
    max-height: 40px;
  }
}
.modal-content > * {
  color: #fff;
  font-size: 14px;
  max-width: 100%;
}
</style>