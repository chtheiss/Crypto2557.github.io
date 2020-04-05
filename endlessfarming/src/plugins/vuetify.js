import "@fortawesome/fontawesome-free/css/all.css"; // Ensure you are using css-loader
import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: "#17191a",
        background: "#26292f",
        secondary: "#d4d5d5",
        action: "#29abe2"
      }
    }
  },
  icons: {
    iconfont: "fa"
  }
});
