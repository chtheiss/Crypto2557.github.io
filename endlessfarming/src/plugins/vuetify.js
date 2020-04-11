import "@fortawesome/fontawesome-free/css/all.css"; // Ensure you are using css-loader
import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

const opts = {
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: "#17191a",
        background: "#26292f",
        secondary: "#d4d5d5",
        action: "#29abe2",
      },
    },
  },
  icons: {
    iconfont: "fa",
  },
};

export default new Vuetify(opts);
