<template>
  <v-hover v-slot:default="{ hover }" :disabled="!editPriorities">
    <v-sheet
      :elevation="hover ? 20 : 5"
      v-bind:id="pet._id"
      class="mx-1 my-2"
      v-bind:class="classObject"
    >
      <PetDialog :pet="pet" :fragments="pet.fragments" :star-thresholds="starThresholds" />
      <p
        v-if="farmableFragments>=0"
        v-bind:id="`${pet._id}-farmable-fragments`"
        class="pet-card-frags"
        v-bind:class="{'availableStage':farmableFragments>0}"
      >{{farmableFragments}}</p>
      <h4 class="pet-card-name">{{ pet.name }}</h4>
      <fieldset class="pet-card-stars mb-2 mt-1">
        <label
          class="image-checkbox"
          v-bind:id="`${pet._id}-${index}star`"
          v-for="(star, index) in stars"
          v-bind:key="index"
        >
          <v-icon color="primary" v-if="star" class="img-responsive">fas fa-star</v-icon>
          <v-icon color="primary" v-else class="img-responsive">far fa-star</v-icon>
          <input type="checkbox" v-on:click="changeValueByStars(index)" />
        </label>
      </fieldset>
      <v-text-field
        v-model="fragments"
        step="1"
        class="pet-card-input"
        dense
        hide-details
        filled
        v-on:focus="inputFocus = true"
        v-on:blur="inputFocus = false"
      >
        <v-icon medium dense slot="prepend" @click="down">mdi-minus</v-icon>
        <v-icon medium dense slot="append-outer" @click="up">mdi-plus</v-icon>
      </v-text-field>
      <div v-if="klRequirement.length" class="pet-card-kl">
        <div
          class="pet-card-kl-number"
          v-for="(req, index) in klRequirement"
          v-bind:key="`kl-${index}`"
          v-bind:class="{'availableStage': req<=knightageLevel}"
        >{{req}}</div>
      </div>
    </v-sheet>
  </v-hover>
</template>

<script>
export default {
  name: "PetCard",
  components: { PetDialog: () => import("../dialogs/petDialog") },
  data: function() {
    return {
      starThresholds: [10, 30, 80, 180, 330],
      stagesPerTwoKl: 10,
      starActive: require("../../assets/img/star.png"),
      starInactive: require("../../assets/img/stargrey.png"),
      inputFocus: false
    };
  },
  props: {
    pet: Object,
    loopIndex: Number,
    knightageLevel: Number,
    farmableFragments: Number,
    petType: {
      type: String,
      default: "shn"
    },
    editPriorities: Number
  },
  methods: {
    changeValueByStars: function(index) {
      this.fragments = this.starThresholds[index];
      this.changeFragments();
    },
    up() {
      this.fragments += 1;
      this.changeFragments();
    },
    down() {
      this.fragments -= 1;
      this.changeFragments();
    },
    changeFragments: async function() {
      if (typeof this.fragments == "number") {
        this.pet.fragments = this.fragments;
      } else if (this.fragments.includes("+")) {
        this.pet.fragments = this.fragments
          .split("+")
          .map(num => parseInt(num) | 0)
          .reduce((a, b) => a + b, 0);
      } else {
        this.pet.fragments = parseInt(this.fragments) | 0;
      }
      this.fragments = this.pet.fragments;
      await this.$store.dispatch("pets/saveValue", this.pet);
    }
  },
  computed: {
    stars: function() {
      return this.starThresholds.map(threshold => {
        return this.fragments >= threshold;
      });
    },
    fragments: {
      get() {
        return this.pet.fragments;
      },
      async set(value) {
        if (typeof value == "number") {
          this.pet.fragments = value;
        } else if (value.includes(".")) {
          this.pet.fragments = eval(value.split(".")[0]);
        } else {
          this.pet.fragments = parseInt(value) | 0;
        }
        await this.$store.dispatch("pets/saveValue", this.pet);
      }
    },
    hideFiveStar: function() {
      return this.$store.state.stats.hide_five_star_pets;
    },
    hideUnattainable: function() {
      return this.$store.state.stats.hide_unattainable_pets;
    },
    classObject: function() {
      return {
        invisible:
          ((this.pet.fragments >= 330) & this.hideFiveStar & !this.inputFocus) |
          ((this.klRequirement.filter(req => req > this.knightageLevel)
            .length ==
            this.klRequirement.length) &
            this.hideUnattainable &
            ((this.petType == "shn") | (this.petType == "shh"))),
        "pet-card": (this.petType == "shn") | (this.petType == "shh"),
        "pet-card-other": (this.petType != "shn") & (this.petType != "shh"),
        "on-hover": !this.editPriorities
      };
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
    },
    klRequirement: function() {
      let requirements = [];
      if (this.petType == "shn") {
        requirements = this.pet.stages.map(stage => {
          return Math.ceil(stage / this.stagesPerTwoKl) * 2;
        });
      } else if (this.petType == "shh") {
        requirements = this.pet.stages.map(stage => {
          return 50 + (stage - 1) * 4;
        });
      }
      return requirements;
    }
  }
};
</script>

<style>
.v-sheet:not(.on-hover) {
  cursor: pointer;
}
.pet-card-kl-number.availableStage,
.pet-card > p.pet-card-frags.availableStage {
  color: var(--v-success-base);
}
.pet-card.invisible,
.pet-card-other.invisible {
  display: none;
}
.five-star,
.four-star,
.one-star,
.three-star,
.two-star,
.zero-star {
  border-width: 1px;
  border-style: solid;
}
.zero-star {
  opacity: 0.8;
  filter: brightness(90%);
  border-color: #555;
  background: #292929;
}
.one-star {
  border-color: #aaa;
  background: radial-gradient(circle, #333 0, #333 0, rgba(170, 170, 170, 0.3));
}
.two-star {
  border-color: #629103;
  background: radial-gradient(circle, #333 0, #333 0, rgba(98, 145, 3, 0.3));
}
.three-star {
  border-color: #3296ff;
  background: radial-gradient(circle, #333 0, #333 0, rgba(50, 150, 347, 0.3));
}
.four-star {
  border-color: #c833c8;
  background: radial-gradient(circle, #333 0, #333 0, rgba(200, 51, 200, 0.3));
}
.five-star {
  border-color: #e03106;
  background: radial-gradient(circle, #333 0, #333 0, rgba(224, 49, 6, 0.3));
}
h4 {
  font-size: 20px;
  margin: 0;
  font-weight: 400;
}

.pet-card {
  display: grid;
  grid-gap: 1px;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1.5fr 1fr 0.8fr 0.8fr;
  grid-template-areas: "pet frags name" "stars stars stars" "input input input" "kl kl kl";
  padding: 2%;
}
@media screen and (max-width: 630px) {
  .pet-card {
    grid-template-columns: 3fr 1fr;
    grid-template-rows: 1.2fr 0.8fr 0.5fr 0.5fr 0.5fr;
    grid-template-areas:
      "pet frags"
      "name name"
      "stars stars"
      "input input"
      "kl kl";
  }
}
.pet-card > * {
  justify-self: center;
  align-self: center;
}
.pet-card-pet {
  grid-area: pet;
  cursor: pointer;
}
.pet-card-frags {
  grid-area: frags;
  font-size: 24px;
  font-weight: bold;
}
.pet-card > p.pet-card-frags {
  margin-bottom: 0px;
  color: var(--v-error-base);
}
.pet-card-name {
  grid-area: name;
  text-align: center;
}
.pet-card-stars {
  grid-area: stars;
  padding: 0;
  border: none;
}
.image-checkbox {
  cursor: pointer;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  margin-bottom: 0;
  outline: 0;
}
.image-checkbox input[type="checkbox"] {
  display: none;
}
img.img-responsive {
  margin: 0 2px;
}
.pet-card-input {
  width: 95%;
  grid-area: input;
  justify-content: center;
  align-content: center;
}
.pet-card-kl {
  grid-area: kl;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-content: center;
  align-content: center;
  justify-self: normal;
}
.pet-card-kl div {
  font-weight: bold;
  color: var(--v-error-base);
  justify-self: center;
}
.pet-card-other {
  display: grid;
  grid-gap: 1px;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1.5fr 0.5fr 1fr;
  grid-template-areas: "pet name" "stars stars" "input input";
  padding: 2%;
}
.pet-card-other > * {
  justify-self: center;
  align-self: center;
}
.pet-card-other > .pet-card-input {
  padding-bottom: 4px;
}
</style>