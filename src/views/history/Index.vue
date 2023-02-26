<template>
  <div>
    <toolbar home />
    <v-container class="mt-8">
      <v-row justify="space-between" class="px-4">
        <h1 class="text-h4 primary--text">ประวัติการเล่น</h1>
        <v-btn color="primary" @click="fetchHistoryAll"
          >ดาวน์โหลดประวัติทั้งหมด (JSON)</v-btn
        >
      </v-row>
      <v-card v-if="!isLoading" class="mt-8 elevation-0">
        <v-simple-table class="secondary">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left py-8"></th>
                <th
                  class="text-left text-h6 font-weight-bold primary--text"
                  style="min-width: 120px"
                >
                  ชื่อเพลง
                </th>
                <th
                  class="text-left text-h6 font-weight-bold primary--text"
                  style="min-width: 180px"
                >
                  คะแนนวง
                </th>
                <th
                  class="text-left text-h6 font-weight-bold primary--text"
                  style="min-width: 160px"
                >
                  วันที่เล่น
                </th>
                <th class="text-left"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in history"
                class="clickable table-record"
                :class="index % 2 === 0 ? 'white' : 'grey lighten-4'"
                :key="index"
                @click="
                  $router.push({
                    name: 'historyDetail',
                    params: { history: item },
                  })
                "
              >
                <td class="pa-2 pa-sm-4 mr-2" style="max-width: 56px">
                  <album-cover
                    :src="item.songCover"
                    style="width: 48px; max-width: 48px; border-radius: 0.5rem"
                  />
                </td>
                <td class="title charcoal--text font-weight-bold">
                  {{ item.songName }}
                </td>
                <td class="title shadow--text font-weight-medium">
                  <span v-if="item && item.players"
                    >{{ item.bandScore }} คะแนน</span
                  >
                </td>
                <td class="title shadow--text font-weight-medium">
                  {{
                    item.createdAt ? displayDate(item.createdAt.toDate()) : ""
                  }}
                </td>
                <td>
                  <v-container>
                    <v-row justify="end">
                      <v-btn color="primary" class="ml-6" icon>
                        <v-icon>mdi-chevron-right</v-icon>
                      </v-btn>
                    </v-row>
                  </v-container>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-btn
          v-if="showLoadMore"
          large
          block
          text
          color="primary"
          @click="fetchHistory(false)"
          >โหลดเพิ่ม</v-btn
        >
        <v-row
          v-if="isMoreLoading"
          class="py-4"
          justify="center"
          align="center"
        >
          <v-progress-circular indeterminate color="primary" /><span
            class="ml-8 title"
            >กำลังโหลด...</span
          >
        </v-row>
      </v-card>
      <v-container v-else>
        <v-row class="mt-12" justify="center" align="center">
          <v-progress-circular indeterminate color="primary" /><span
            class="ml-8 title"
            >กำลังโหลด...</span
          >
        </v-row>
      </v-container>
    </v-container>
  </div>
</template>
<script>
import {
  FETCH_HISTORY,
  FETCH_HISTORY_ALL,
  FETCH_SONG_LIST,
  FETCH_PLAYER_LIST,
  ERROR,
  TOAST_SUCCESS,
} from "@/store/actions.type";
// import { FileType } from "@/store/modules/music.module";
import Toolbar from "@/components/Toolbar";
import AlbumCover from "@/components/AlbumCover";
import scoreMixin from "@/mixins/score";
// import { clone } from "@/utils/helper";
import { Parser } from "json2csv";
import { mapGetters } from "vuex";

export default {
  name: "History",
  components: {
    Toolbar,
    AlbumCover,
  },
  computed: {
    ...mapGetters(["account"]),
  },
  mixins: [scoreMixin],
  data() {
    return {
      isLoading: false,
      isMoreLoading: false,
      history: null,
      songs: null,
      players: null,
      showLoadMore: false,
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.isLoading = true;

      this.songs = await this.$store.dispatch(FETCH_SONG_LIST, true);
      this.players = await this.$store.dispatch(FETCH_PLAYER_LIST, true);
      await this.fetchHistory(true);

      this.isLoading = false;
    },
    async fetchHistory(isFirstPage) {
      this.isMoreLoading = true;

      const historyPage = await this.$store.dispatch(
        FETCH_HISTORY,
        isFirstPage
      );

      // console.log(JSON.stringify(historyPage));

      const processedHistory = this.processInfo(historyPage);

      this.history = [...(this.history || []), ...processedHistory];
      this.showLoadMore =
        historyPage.length >= this.$store.state.history.historyLimit;

      this.isMoreLoading = false;
    },
    async fetchHistoryAll() {
      const historyALL = await this.$store.dispatch(FETCH_HISTORY_ALL);

      this.downloadJson(historyALL);
    },
    processInfo(rawHistory) {
      if (history && this.songs && this.players) {
        const history = rawHistory.map((record) => ({
          ...record,
          songCover: (
            this.songs.find((song) => song.id === record.songId) || {}
          ).cover,
          songName: (this.songs.find((song) => song.id === record.songId) || {})
            .name,
          players: record.players.map((player) => {
            if (player.devices && player.devices.length > 0) {
              const targetStat = player.devices.map((deviceId) => {
                const stat = record.stats.find(
                  (stat) => stat.deviceId === deviceId
                );
                return stat;
              });

              const targetPlayer = this.players.find(
                (_player) => _player.id === player.id
              );

              const filteredTargetStat = targetStat.filter(
                (element) => element !== undefined
              );

              return {
                ...player,
                ...targetPlayer,
                delay:
                  filteredTargetStat.length > 0
                    ? (
                        filteredTargetStat.map((stat) => stat.avarageDelay) ||
                        []
                      ).reduce((a, b) => a + b, 0) / filteredTargetStat.length
                    : 0,
                accuaracy:
                  filteredTargetStat.length > 0
                    ? (
                        filteredTargetStat.map(
                          (stat) =>
                            (stat.hitNoteCount / stat.allNoteCount) * 100
                        ) || []
                      ).reduce((a, b) => a + b, 0) / filteredTargetStat.length
                    : 0,
                score: this.calculatePlayerScore(
                  filteredTargetStat.length > 0
                    ? (
                        filteredTargetStat.map((stat) => stat.score) || []
                      ).reduce((a, b) => a + b, 0) / filteredTargetStat.length
                    : 0
                ),
              };
            }
            return player;
          }),
        }));

        const processedHistory = history.map((record) => ({
          ...record,
          bandScore: this.calculateBandScore(record.players),
        }));

        console.log("processedHistory", JSON.stringify(processedHistory));

        // 42fc6fcd-3d12-447d-9184-0c1e0c4f5df5
        // this.filterLogByPlayer(
        //   processedHistory,
        //   "17d0b2f9-2aac-4fe9-a0aa-ce12c08bc294"
        // );

        return processedHistory;
      } else {
        this.$store.dispatch(ERROR, "เกิดข้อผิดพลาดขึ้น โปรดลองอีกครั้ง");
        return [];
      }
    },
    filterLogByPlayer(history, playerId) {
      const result = [];
      history.forEach((record) => {
        const targetPlayer = record.players.filter(
          (player) => player.id === playerId
        );
        if (targetPlayer.length > 0) {
          result.push(record);
          // let targetRecord = clone(record);
          // delete targetRecord.players;
          // delete targetRecord.stats;
          // delete targetRecord.songCover;
          // delete targetRecord.songId;

          // const { name, score, delay, accuaracy } = targetPlayer[0];

          // targetRecord = {
          //   ...targetRecord,
          //   name,
          //   score,
          //   delay,
          //   accuaracy,
          //   createdAt: record.createdAt.toDate().toISOString(),
          // };

          // result.push(targetRecord);
        }
      });

      console.log(JSON.stringify(result));

      this.downloadCsv(result);
    },
    downloadCsv(json) {
      try {
        const parser = new Parser();
        const csv = parser.parse(json);
        console.log(csv);

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "my_data.csv");
        document.body.appendChild(link);

        link.click();
      } catch (err) {
        console.error(err);
      }
    },
    downloadJson(json) {
      try {
        const blob = new Blob([JSON.stringify(json)], {
          type: "text/json;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `ประวัติการเล่น-${this.account.name || ""}.json`
        );
        document.body.appendChild(link);

        link.click();

        this.$store.dispatch(TOAST_SUCCESS, `ดาวน์โหลด ${json.length} รายการ`);
      } catch (err) {
        console.error(err);
      }
    },
    displayDate(iso) {
      const date = new Date(iso);
      return `${date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}, ${date.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      })} น.`;
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

tr:nth-child(even) {
  background-color: white;
}

.table-record {
  &:hover {
    background: rgba(237, 236, 235, 0.8) !important;
  }
}
</style>