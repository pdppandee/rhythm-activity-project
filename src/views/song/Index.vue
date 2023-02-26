<template>
  <div>
    <toolbar home />
    <v-container>
      <v-container>
        <v-row justify="space-between" align="center">
          <div class="d-flex">
            <h1 class="text-h4 font-weight-regular">จัดการเพลง</h1>
            <v-progress-circular
              v-if="fetching"
              class="ml-4"
              color="primary"
              indeterminate
            />
          </div>
          <v-btn large color="primary" @click="launchSongDetail({})"
            >เพิ่มเพลง</v-btn
          >
        </v-row>
      </v-container>
      <v-card v-if="songs" class="mt-4 elevation-0">
        <v-simple-table class="secondary">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left py-8"></th>
                <th class="text-left text-h6 font-weight-bold primary--text">
                  ชื่อเพลง
                </th>
                <th class="text-left text-h6 font-weight-bold primary--text" style="min-width: 180px">
                  ไฟล์ที่อัปโหลด
                </th>
                <th class="text-left text-h6 font-weight-bold primary--text" style="min-width: 160px">
                  แก้ไขล่าสุด
                </th>
                <th class="text-left"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in songs"
                :class="index % 2 === 0 ? 'white' : 'grey lighten-4'"
                :key="index"
              >
                <td class="pa-2 pa-sm-4 mr-2" style="max-width: 56px">
                  <album-cover :src="item.cover" style="width: 48px; max-width: 48px; border-radius: 0.5rem;"/>
                </td>
                <td class="title charcoal--text font-weight-bold">
                  {{ item.name }}
                </td>
                <td class="title shadow--text font-weight-medium">
                  <span v-if="item.mp3">mp3</span>
                  <span
                    v-if="
                      item.mp3 &&
                      (item.midiEasy || item.midiMedium || item.midiHard)
                    "
                    >,
                  </span>
                  <span v-if="item.midiEasy || item.midiMedium || item.midiHard"
                    >midi ({{
                      [item.midiEasy, item.midiMedium, item.midiHard].filter(
                        (x) => x
                      ).length
                    }})</span
                  >
                </td>
                <td class="title shadow--text font-weight-medium">
                  {{
                    item.updatedAt ? displayDate(item.updatedAt.toDate()) : ""
                  }}
                </td>
                <td>
                  <v-container>
                    <v-row justify="end">
                      <v-btn color="primary" icon>
                        <v-icon @click="launchSongDetail(item)"
                          >mdi-pencil</v-icon
                        >
                      </v-btn>
                      <v-btn color="primary" class="ml-6" icon>
                        <v-icon
                          @click="
                            songToBeDeleted = { dialog: true, song: item }
                          "
                          >mdi-delete</v-icon
                        >
                      </v-btn>
                    </v-row>
                  </v-container>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
      <v-container v-else>
        <v-row class="mt-8" justify="center">
          <span>กำลังโหลด...</span>
        </v-row>
      </v-container>
      <song-detail
        :song="selectedSong"
        @close="selectedSong = null"
        @saved="fetch"
      />
      <simple-dialog
        alert
        v-model="songToBeDeleted.dialog"
        title="ยืนยันการลบ"
        :message="`คุณต้องการจะลบเพลง${
          songToBeDeleted && songToBeDeleted.song
            ? songToBeDeleted.song.name
            : 'นี้'
        } ใช่หรือไม่`"
        positiveMessage="ยืนยัน"
        negativeMessage="ยกเลิก"
        @positive="deleteSong(songToBeDeleted.song)"
      />
    </v-container>
  </div>
</template>
<script>
import { mapState } from "vuex";
import {
  FETCH_SONG_LIST,
  ERROR,
  DELETE_MUSIC_FILE,
  DELETE_SONG,
} from "@/store/actions.type";
import { FileType } from "@/store/modules/music.module";
import SimpleDialog from "@/components/SimpleDialog";
import AlbumCover from "@/components/AlbumCover";
import Toolbar from "@/components/Toolbar";
import SongDetail from "./SongDetail";
// import { PubSub } from "aws-amplify";

export default {
  computed: {
    ...mapState({
      songs: (state) => state.music.songs,
    }),
  },
  components: {
    SongDetail,
    SimpleDialog,
    AlbumCover,
    Toolbar,
  },
  data() {
    return {
      fetching: false,
      selectedSong: null,
      songToBeDeleted: {
        dialog: false,
        song: null,
      },
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      await this.$store.dispatch(FETCH_SONG_LIST, true);
    },
    launchSongDetail(song) {
      this.selectedSong = song;
    },
    displayDate(iso) {
      const date = new Date(iso);
      return date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    async deleteSong(song) {
      try {
        this.fetching = true;
        await Promise.all(
          Object.keys(FileType)
            .map((key) => FileType[key])
            .map(async (field) => {
              await this.$store
                .dispatch(DELETE_MUSIC_FILE, { song, field })
                .catch(() => {});
            })
        );
        await this.$store.dispatch(DELETE_SONG, song);
        this.fetch();
      } catch (_) {
        this.$store.dispatch(
          ERROR,
          "เกิดข้อผิดพลาดขึ้น โปรดลองอีกครั้งในภายหลัง"
        );
      } finally {
        this.fetching = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.title {
  font-weight: 600;
}

table,
th,
tr,
td {
  border-bottom: 0px !important;
}
</style>