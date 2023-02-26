<template>
  <div class="text-center">
    <v-menu top close-on-click>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="btn-options"
          v-bind="attrs"
          v-on="on"
          color="primary"
          outlined
        >
          <v-icon> mdi-music-note </v-icon>
          ระดับความยาก
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          link
          v-for="(item, index) in options"
          :key="index"
          @click="select(index)"
        >
          <v-list-item-title
            :class="{
              ['primary--text font-weight-bold']: selectedMidiPath === item.value,
            }"
            >{{ item.title }}</v-list-item-title
          >
          <v-list-item-icon v-if="selectedMidiPath === item.value">
            <v-icon color="primary">mdi-check</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { FileType } from "@/store/modules/music.module";

export default {
  computed: {
    ...mapState({
      selectedMidiPath: (state) => state.play.midiPath,
      options: (state) => {
        return [
          { title: "ง่าย", value: state.play.song[FileType.MIDI_EASY] },
          { title: "ปานกลาง", value: state.play.song[FileType.MIDI_MEDIUM] },
          { title: "ยาก", value: state.play.song[FileType.MIDI_HARD] },
        ].filter(item => item.value);
      },
    }),
  },
  data() {
    return {
    };
  },
  methods: {
    select(index) {
      this.$emit("selected", this.options[index].value);
    },
  },
};
</script>
<style scoped>
.btn-options {
  height: 42px !important;
}
</style>