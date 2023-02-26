<template>
  <div class="text-center">
    <v-menu top close-on-click>
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="btn-volume" v-bind="attrs" v-on="on" color="primary" outlined>
          <v-icon>mdi-volume-high</v-icon>
        </v-btn>
      </template>

      <div class="pa-4 white">
        <v-slider
          style="border-radius: 4px"
          value="100"
          loader-height="10"
          hide-details
          track-color="darkBase"
          prepend-icon="mdi-volume-high"
          vertical
          @input="adjustVolume"
        ></v-slider>
      </div>
    </v-menu>
  </div>
</template>
<script>
export default {
  computed: {},
  data() {
    return {
      selectedItem: 1,
      items: [
        { title: "ช้า (0.5X)", value: 0.5 },
        { title: "ปกติ (1X)", value: 1 },
        { title: "เร็ว (2X)", value: 2 },
      ],
    };
  },
  methods: {
    adjustVolume(volume) {
      this.$emit("adjust", volume)
    },
  },
};
</script>
<style scoped>
.btn-volume {
  width: 42px !important;
  height: 42px !important;
  min-width: 42px !important;
}
</style>