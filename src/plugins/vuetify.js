import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#1C3F52",
        secondary: "#C6E1EA",
        accent: "#F9DCDC",
        error: "#DE736C",
        info: "#C6E1EA",
        success: "#91BE6E",
        greenLight: "#C8DFD4",
        placeholder: "#FAF8F5",
        warning: "#E8B73C",
        primaryVariant: "#25526B",
        smoke: "#C2BFB7",
        shadow: "#5C5A57",
        charcoal: "#292826",
        darkBase: "#EDECEB",
      },
    },
    options: { customProperties: true },
  },
});
