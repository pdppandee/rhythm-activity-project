<template>
  <!-- <amplify-authenticator> -->
  <v-app>
    <v-flex
      v-if="error"
      class="pa-4"
      justify="center"
      style="position: fixed; width: 100%; bottom: 0; z-index: 1000"
    >
      <v-alert class="toast pr-8" prominent type="error">
        <span class="text-h5">{{ error }}</span>
      </v-alert>
    </v-flex>
    <v-flex
      v-if="toastSuccess"
      class="pa-4"
      justify="center"
      style="position: fixed; width: 100%; bottom: 0; z-index: 1000"
    >
      <v-alert class="toast pr-8" prominent type="success">
        <span class="text-h5">{{ toastSuccess }}</span>
      </v-alert>
    </v-flex>
    <keep-alive include="History">
      <router-view />
    </keep-alive>
  </v-app>
  <!-- <amplify-sign-out></amplify-sign-out>
  </amplify-authenticator> -->
</template>

<script>
import { mapState } from "vuex";
// import { PubSub } from 'aws-amplify';
export default {
  name: "App",
  computed: {
    ...mapState({
      error: (state) => state.ui.error,
      toastSuccess: (state) => state.ui.toastSuccess,
    }),
  },
  data: () => ({
    //
  }),
  created() {
    // 488294325426
    // ap-southeast-1
  },
  async mounted() {
    // const result = await PubSub.publish("TEST", { msg: 'Hello World' })
    // console.log('result', result)
    // PubSub.subscribe("TEST").subscribe({
    //   next: data => console.log(data),
    //   error: error => console.error(error),
    //   close: () => console.log('Done'),
    // });
  },
  methods: {
    reload(name) {
      this.$router.replace({ name: "home" });
      setTimeout(() => {
        this.$router.replace({ name });
      }, 10);
    },
    reloadPlayer() {
      this.$router.replace({ name: "device" });
      setTimeout(() => {
        this.$router.replace({ name: "player" });
      }, 100);
    },
  },
};
</script>
<style lang="scss">
// @import "./styles/main.scss";
#app {
  background-color: #faf8f5 !important;
  background-image: url("./assets/images/bg-pattern.png");
  background-repeat: repeat-x;
  background-position: bottom;
  background-attachment: fixed;
}
.clickable {
  cursor: pointer;
}
.circle-border {
  border-radius: 50%;
}
.v-btn {
  height: inherit;
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
  font-weight: 700 !important;

  &.v-size--large {
    height: 64px !important;
    font-size: 1.4rem !important;
  }
}
.v-btn--outlined {
  &.v-size--large {
    border-width: 2px !important;
  }
}
.v-stepper__step--inactive > .v-stepper__step__step {
  background: #edeceb !important;
  color: #999790 !important;
}
.toast {
  width: fit-content;
  margin: 0 auto;
  max-width: 100%;
}
</style>