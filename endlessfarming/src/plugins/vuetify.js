import "@fortawesome/fontawesome-free/css/all.css"; // Ensure you are using css-loader
import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);
/*
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
*/
const opts = {
  theme: {
    dark: true,
    options: {
      customProperties: true,
    },
    themes: {
      dark: {
        primary: "#29abe2",
        secondary: "#17191a",
        background: "#2f3136",
        accent: "#F12E5E",
      },
    },
  },
  icons: {
    iconfont: "fa",
  },
};

export default new Vuetify(opts);
