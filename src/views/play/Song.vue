<template>
  <v-container>
    <progress-step :step="2" />
    <v-row class="my-4" justify="center">
      <h1 class="primary--text text-center px-4">ขั้นตอนที่ 2: เลือกเพลง</h1>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="4" md="3" v-for="song in songs" :key="song.id">
        <v-card
          class="clickable fill-height hidden-xs-only"
          v-ripple
          @click="selectSong(song)"
        >
          <album-cover :src="song.cover" />
          <v-container>
            <v-row class="py-8 px-6" justify="center">
              <span
                class="charcoal--text text-h5 font-weight-bold text-center"
                >{{ song.name }}</span
              >
            </v-row>
          </v-container>
        </v-card>
        <v-card
          class="clickable fill-height hidden-sm-and-up"
          v-ripple
          @click="selectSong(song)"
        >
          <v-container>
            <v-row>
              <v-card class="album-cover-mobile elevation-0">
                <album-cover :src="song.cover" />
              </v-card>
              <v-col class="ma-0 pa-3" align-self="center">
                <h1
                  class="
                    album-title-mobile
                    charcoal--text
                    text-h5
                    font-weight-bold
                    fill-height
                  "
                >
                  {{ song.name }}
                </h1>
              </v-col>
            </v-row>
          </v-container>
          <!-- <v-container>
            <v-row class="py-8 px-6" justify="center">
              <span class="charcoal--text text-h5 font-weight-bold text-center">{{
                song.name
              }}</span>
            </v-row>
          </v-container> -->
        </v-card>
      </v-col>
    </v-row>
    <progress-dialog v-model="isSongFetching" message="กำลังโหลดเพลง..." />
  </v-container>
</template>
<script>
import { mapState } from "vuex";
import { FETCH_SONG_LIST, SELECT_SONG } from "@/store/actions.type";
import ProgressStep from "@/components/ProgressStep";
import playMixin from "@/mixins/play";
import AlbumCover from "@/components/AlbumCover.vue";
import ProgressDialog from "@/components/ProgressDialog.vue";

export default {
  components: { ProgressStep, AlbumCover, ProgressDialog },
  mixins: [playMixin],
  computed: {
    ...mapState({
      songs: (state) => state.music.songs,
      isSongFetching: (state) => state.music.isSongFetching,
    }),
    iconMusic: () => require("@/assets/images/music.svg"),
  },
  data() {
    return {};
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      await this.$store.dispatch(FETCH_SONG_LIST);
    },
    selectSong(song) {
      this.$store.dispatch(SELECT_SONG, song);
      this.$router.replace({ name: "level" });
    },
  },
};
</script>
<style scoped>
.v-stepper {
  background: none;
  box-shadow: none;
}
.album-cover-mobile {
  width: 8rem;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.album-title-mobile {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>