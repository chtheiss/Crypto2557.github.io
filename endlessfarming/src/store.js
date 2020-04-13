import Vue from "vue";
import Vuex from "vuex";

import { stats } from "./modules/stats";
import { pets } from "./modules/pets";
import { units } from "./modules/units";
import { transfer } from "./modules/transfer";

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    stats,
    pets,
    units,
    transfer
  }
});
