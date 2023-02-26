<template>
  <div>
    <v-container class="mt-8">
      <v-row>
        <v-btn v-show="step > 1" color="primary" outlined @click="onBack">
          <v-icon left> mdi-chevron-left </v-icon>
          ขั้นตอนก่อนหน้า
        </v-btn>
        <v-spacer />
        <home-button />
      </v-row>
    </v-container>
    <v-stepper v-if="!hideStep" v-model="step" alt-labels class="elevation-0">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1"></v-stepper-step>

        <v-divider />

        <v-stepper-step :complete="step > 2" step="2"></v-stepper-step>

        <v-divider />

        <v-stepper-step :complete="step > 3" step="3"></v-stepper-step>

        <v-divider />

        <v-stepper-step :complete="step > 4" step="4"></v-stepper-step>
      </v-stepper-header>
    </v-stepper>
  </div>
</template>
<script>
import HomeButton from "@/components/HomeButton.vue";
export default {
  components: { HomeButton },
  props: {
    step: Number,
    hideStep: {
      type: Boolean,
      default: false,
    },
  },
  created() {
  },
  methods: {
    onBack() {
      switch(this.$route.name) {
        case "pickSong": this.$router.replace({ name: "pickBand" }); break;
        case "level": this.$router.replace({ name: "pickSong" }); break;
        case "device": this.$router.replace({ name: "level" }); break;
        case "player": this.$router.replace({ name: "device" }); break;
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.theme--light.v-stepper {
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;
  background: transparent;
}

.v-stepper--alt-labels .v-stepper__step {
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-basis: 0px;
}

.v-divider {
  border-top-width: 2px;
  border-color: #C2BFB7 !important;
  margin-left: -15px !important;
  margin-right: -15px !important;
}
</style>
