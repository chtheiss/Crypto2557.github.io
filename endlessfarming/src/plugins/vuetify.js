import "@fortawesome/fontawesome-free/css/all.css"; // Ensure you are using css-loader
import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);
const opts = {
  theme: {
    dark: true,
    options: {
      customProperties: true
    },
    themes: {
      dark: {
        primary: "#29abe2",
        secondary: "#17191a",
        background: "#26292f",
        success: "#1ca51c",
        info: "#29abe2"
      }
    }
  },
  icons: {
    iconfont: "fa"
  }
};

export default new Vuetify(opts);
