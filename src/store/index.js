import Vue from "vue";
import Vuex from "vuex";

import music from "@/store/modules/music.module";
import auth from "@/store/modules/auth.module";
import user from "@/store/modules/user.module";
import play from "@/store/modules/play.module";
import device from "@/store/modules/device.module";
import ui from "@/store/modules/ui.module";
import history from "@/store/modules/history.module";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    music,
    auth,
    user,
    play,
    device,
    ui,
    history,
  }
});