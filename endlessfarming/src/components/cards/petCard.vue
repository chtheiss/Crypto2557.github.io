<template>
  <div v-bind:id="pet._id" class="pet-card bordered noselect" v-bind:class="classObject">
    <span class="pet-modal pet-card-pet">
      <img
        v-bind:id="`${pet._id}-image`"
        class="pet-image"
        v-bind:class="activeBackgroundClass"
        :src="require(`../../assets/img/pets/${pet._id}.png`)"
        aspect-ratio="1"
      />
    </span>
    <p v-bind:id="`${pet._id}-farmable-fragments`" class="pet-card-frags">{{farmableFragments}}</p>
    <h4 class="pet-card-name">{{ pet.name }}</h4>
    <fieldset class="pet-card-stars">
      <label
        class="image-checkbox"
        v-bind:id="`${pet._id}-${index}star`"
        v-for="(star, index) in stars"
        v-bind:key="index"
      >
        <img v-if="star" class="img-responsive" v-bind:src="starActive" />
        <img v-else class="img-responsive" v-bind:src="starInactive" />
        <input type="checkbox" v-on:click="changeValueByStar(index)" />
      </label>
    </fieldset>
    <v-text-field
      v-model.number="fragments"
      step="1"
      class="pet-card-input"
      dense
      hide-details
      filled
    >
      <v-icon medium dense slot="prepend" color="#fff" @click="down">mdi-minus</v-icon>
      <v-icon medium dense slot="append-outer" color="#fff" @click="up">mdi-plus</v-icon>
    </v-text-field>
    <div class="pet-card-kl">
      <div
        class="pet-card-kl-number"
        v-for="(req, index) in klRequirement"
        v-bind:key="`kl-${index}`"
        v-bind:class="{'availableStage': req<=knightageLevel}"
      >{{req}}</div>
    </div>
  </div>
</template>

<script>
String.prototype.replaceAll = function(search, replacement) {
  let target = this;
  return target.replace(new RegExp(search, "g"), replacement);
};

export default {
  name: "PetCard",
  data: () => ({
    starThresholds: [10, 30, 80, 180, 330],
    stagesPerTwoKl: 10,
    starActive: require("../../assets/img/star.png"),
    starInactive: require("../../assets/img/stargrey.png"),
    farmableFragments: 0
  }),
  props: {
    pet: Object,
    loopIndex: Number
  },
  methods: {
    changeValueByStar: function(index) {
      this.fragments = this.starThresholds[index];
    },
    up() {
      this.fragments += 1;
    },
    down() {
      this.fragments -= 1;
    }
  },
  computed: {
    stars: function() {
      return this.starThresholds.map(threshold => {
        return this.fragments >= threshold;
      });
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
          ((this.fragments >= 330) & this.hideFiveStar) |
          ((this.klRequirement.filter(req => req > this.knightageLevel)
            .length ==
            this.klRequirement.length) &
            this.hideUnattainable)
      };
    },
    fragments: {
      get() {
        return this.pet.fragments | 0;
      },
      async set(value) {
        this.pet.fragments = value;
        await this.$store.dispatch("pets/saveValue", this.pet);
      }
    },
    knightageLevel: function() {
      return this.$store.state.stats.KL;
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
      let requirements = this.pet.stages.map(stage => {
        return Math.ceil(stage / this.stagesPerTwoKl) * 2;
      });
      return requirements;
    }
  }
};
</script>

<style>
.pet-card-kl-number.availableStage {
  color: #1ca51c;
}
.pet-card.invisible {
  display: none;
}
.input-number.pet-card-input .v-input__append-outer {
  margin-top: 7px !important;
  margin-left: 1px !important;
}
.input-number.pet-card-input .v-input__prepend-outer {
  margin-top: 7px !important;
  margin-right: 1px !important;
}
.input-number.pet-card-input .v-input__slot,
.input-number.pet-card-input .v-input__control {
  min-height: 30px !important;
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
  font-size: 16px;
  margin: 0;
  font-weight: 400;
}
.pet-image {
  max-height: 45px;
}
@media all and (max-width: 768px) {
  .pet-image {
    max-height: 40px;
  }
}
.pet-pets .pet-card:hover {
  background-color: #393c3f;
  cursor: pointer;
}
.pet-card {
  display: grid;
  grid-gap: 1px;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1.5fr 1fr 0.8fr 0.8fr;
  grid-template-areas: "pet frags name" "stars stars stars" "input input input" "kl kl kl";
  padding: 5% 1% 1% 1%;
  margin: 1%;
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
}
.pet-card-frags {
  grid-area: frags;
  font-size: 24px;
  font-weight: bold;
}
.pet-card > p.pet-card-frags {
  margin-bottom: 0px;
  color: #ce2323;
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
  color: #ce2323;
  justify-self: center;
}
</style>