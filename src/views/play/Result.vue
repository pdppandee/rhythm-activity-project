<template>
  <div>
    <toolbar home />
    <v-container>
      <v-row justify="center" style="max-width: 900px; margin: 0 auto">
        <v-col
          v-if="leaderBoard.length >= 1 && leaderBoard[1]"
          cols="12"
          sm="3"
          class="order-1 order-sm-0"
        >
          <v-row justify="center" style="height: 220px">
            <div class="frame-wrapper">
              <img
                class="avatar2-img"
                :src="
                  leaderBoard[1].imageUrl ||
                  require('@/assets/images/user-placeholder.svg')
                "
              />
              <img
                class="frame2-img"
                :src="require('@/assets/images/winner2-frame.svg')"
              />
            </div>
          </v-row>
          <v-row align="center" class="flex-column">
            <span class="text-h5 font-weight-bold primary--text">{{
              leaderBoard[1].name
            }}</span>
            <span class="primary--text">{{ leaderBoard[1].score }} คะแนน</span>
          </v-row>
        </v-col>
        <v-col
          v-if="leaderBoard.length >= 0 && leaderBoard[0]"
          cols="12"
          sm="4"
          class="order-0 order-sm-1"
        >
          <v-row justify="center" style="height: 220px">
            <div class="frame-wrapper">
              <img
                class="avatar-img"
                :src="
                  leaderBoard[0].imageUrl ||
                  require('@/assets/images/user-placeholder.svg')
                "
              />
              <img
                class="frame-img"
                :src="require('@/assets/images/winner1-frame.svg')"
              />
            </div>
          </v-row>
          <v-row align="center" class="flex-column order-sm-2">
            <span class="text-h5 font-weight-bold primary--text">{{
              leaderBoard[0].name
            }}</span>
            <span class="primary--text">{{ leaderBoard[0].score }} คะแนน</span>
          </v-row>
        </v-col>
        <v-col
          v-if="leaderBoard.length >= 2 && leaderBoard[2]"
          cols="12"
          sm="3"
          class="order-2"
        >
          <v-row justify="center" style="height: 220px">
            <div class="frame-wrapper">
              <img
                class="avatar2-img"
                :src="
                  leaderBoard[2].imageUrl ||
                  require('@/assets/images/user-placeholder.svg')
                "
              />
              <img
                class="frame2-img"
                :src="require('@/assets/images/winner3-frame.svg')"
              />
            </div>
          </v-row>
          <v-row align="center" class="flex-column">
            <span class="text-h5 font-weight-bold primary--text">{{
              leaderBoard[2].name
            }}</span>
            <span class="primary--text">{{ leaderBoard[2].score }} คะแนน</span>
          </v-row>
        </v-col>
      </v-row>
      <v-row justify="center" class="my-8 mx-4">
        <v-card style="width: 100%; max-width: 628px">
          <table>
            <tr v-for="(player, index) in leaderBoard.slice(3)" :key="index">
              <v-row class="px-8 py-6" align="center" justify="space-between">
                <v-row class="pa-0 ma-0" align="center">
                  <div class="ranking-number">
                    <span class="title font-weight-bold primary--text">{{
                      index + 3
                    }}</span>
                  </div>
                  <img
                    :src="
                      player.imageUrl ||
                      require('@/assets/images/user-placeholder.svg')
                    "
                    class="ranking-avatar ml-6"
                  />
                  <span class="title font-weight-bold charcoal--text ml-8">{{
                    player.name
                  }}</span>
                </v-row>
                <span class="title shadow--text ml-4"
                  >{{ player.score }} คะแนน</span
                >
              </v-row>
            </tr>
            <tr>
              <v-row class="pa-8" align="center" justify="space-between">
                <span class="text-h5 font-weight-bold primary--text"
                  >คะแนนวง</span
                >
                <span class="text-h5 font-weight-bold primary--text"
                  >{{ calculateBandScore(leaderBoard) }} คะแนน</span
                >
              </v-row>
            </tr>
          </table>
        </v-card>
      </v-row>
      <v-row
        justify="space-between"
        class="my-8 mx-auto"
        style="max-width: 900px"
      >
        <v-btn
          color="primary"
          outlined
          class="my-2"
          large
          @click="$router.replace({ name: 'player' })"
          >เล่นซ้ำอีกครั้ง</v-btn
        >
        <v-btn
          color="primary"
          large
          class="my-2"
          @click="$router.replace({ name: 'pickSong' })"
          >เลือกเพลงใหม่</v-btn
        >
      </v-row>
      <v-row v-if="isSaving" justify="center">
        <v-progress-circular class="mr-8" color="primary" indeterminate />
        <span style="align-self: center">กำลังบันทึก...</span>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { v4 } from "uuid";
import { SAVE_LOG_RESULT, ERROR } from "@/store/actions.type";
import Toolbar from "@/components/Toolbar";
import scoreMixin from "@/mixins/score";

export default {
  components: { Toolbar },
  mixins: [scoreMixin],
  computed: {
    ...mapState({
      players: (state) => state.play.players,
      song: (state) => state.play.song,
      log: (state) => state.play.log,
      midiPath: (state) => state.play.midiPath,
    }),
    ...mapGetters(["processScores"]),
  },
  watch: {
    processScores() {
      this.process();
    },
    players() {
      this.process();
    },
  },
  data() {
    return {
      leaderBoard: [],
      isSaving: false,
      alreadyCalculateScore: false,
      logId: v4(),
    };
  },
  created() {},
  mounted() {
    this.process();
  },
  methods: {
    process() {
      // console.log("players", JSON.stringify(this.players));
      // console.log("log", this.processScores);

      if (!this.alreadyCalculateScore) {
        this.alreadyCalculateScore = true;
        
        if (this.processScores && this.players && this.song && this.log) {
          this.saveLog(this.processScores, this.players, this.song, this.log);

          this.leaderBoard = this.players.map((player) => {
            if (player.devices && player.devices.length > 0) {
              const scores = player.devices.map((device) => {
                const targetDevice = this.processScores.find(
                  (deviceScore) => deviceScore.deviceId === device.id
                );
                return targetDevice ? targetDevice.score : 0;
              });
              return {
                ...player,
                score: this.calculatePlayerScore(
                  scores.reduce((a, b) => a + b, 0) / scores.length
                ),
              };
            }
            return player;
          });
        }

        this.leaderBoard = this.leaderBoard.sort((a, b) => b.score - a.score);
        // console.log("leaderBoard", this.leaderBoard);
      }
    },
    async saveLog(processScores, players, song, log) {
      try {
        this.isSaving = true;
        const level = this.getLevelName();
        console.log("level", level);

        await this.$store.dispatch(SAVE_LOG_RESULT, {
          logId: this.logId,
          songId: song.id,
          stats: processScores,
          players,
          log,
          level,
        });
      } catch (error) {
        console.error(error);
        this.$store.dispatch(
          ERROR,
          "เกิดข้อผิดพลาดในการบันทึกข้อมูล โปรดติดต่อนักพัฒนา"
        );
      }
      this.isSaving = false;
    },
    getLevelName() {
      let levelName = "";

      switch (this.midiPath) {
        case this.song.midiEasy:
          levelName = "ง่าย";
          break;
        case this.song.midiMedium:
          levelName = "ปานกลาง";
          break;
        default:
          levelName = "ยาก";
      }

      return levelName;
    },
  },
};
</script>

<style lang="scss" scoped>
.frame-wrapper {
  position: relative;
}

.frame-img {
  position: absolute;
  width: 207px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.avatar-img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -51%);
  width: 136px;
  height: 136px;
  object-fit: cover;
}

.frame2-img {
  position: absolute;
  width: 170px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -40%);
}

.avatar2-img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -44%);
  width: 120px;
  height: 120px;
  object-fit: cover;
}

table {
  background: #ffffff;
  width: 100%;
  border-spacing: 0px;
  overflow: hidden;
}

th,
td {
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: rgba(92, 90, 87, 0.08);
}

tr:last-child {
  background: rgba(92, 90, 87, 0.1);
  border-radius: 16px;
}

.ranking-number {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #c6e1ea;
}

.ranking-avatar {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
}
</style>