<template>
  <v-container>
    <progress-step :step="3" />
    <v-row class="my-4" justify="center">
      <h1 class="primary--text text-center px-4">ขั้นตอนที่ 3: เลือกระดับความยากง่าย</h1>
    </v-row>
    <v-row justify="center">
      <v-col cols="6" sm="4" md="3" v-if="song.midiEasy">
        <menu-tile
          :src="require('@/assets/images/level-easy.svg')"
          title="ง่าย"
          color="grey--text text--darken-4"
          background="secondary"
          @onClick="selectLevel(song.midiEasy)"
        />
      </v-col>
      <v-col cols="6" sm="4" md="3" v-if="song.midiMedium">
        <menu-tile
          :src="require('@/assets/images/level-medium.svg')"
          title="ปานกลาง"
          color="grey--text text--darken-4"
          background="secondary"
          @onClick="selectLevel(song.midiMedium)"
        />
      </v-col>
      <v-col cols="6" sm="4" md="3" v-if="song.midiHard">
        <menu-tile
          :src="require('@/assets/images/level-hard.svg')"
          title="ยาก"
          color="grey--text text--darken-4"
          background="secondary"
          @onClick="selectLevel(song.midiHard)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { SELECT_LEVEL } from "@/store/actions.type";
import ProgressStep from "@/components/ProgressStep";
import MenuTile from "@/components/MenuTile";
import playMixin from "@/mixins/play";
import { mapState } from "vuex";

export default {
  components: { ProgressStep, MenuTile },
  mixins: [playMixin],
  computed: {
    ...mapState({
      song: (state) => state.play.song,
    }),
  },
  methods: {
    selectLevel(midiPath) {
      this.$store.dispatch(SELECT_LEVEL, midiPath);
      this.$router.replace({ name: "device" });
    },
  },
};
</script>
<style scoped>
.v-stepper {
  background: none;
  box-shadow: none;
}
</style>