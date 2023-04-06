<template>
  <div class="px-8">
    <progress-step :step="5" hideStep />
    <v-container class="px-8" style="max-width: 1000px">
      <v-row justify="center" class="mt-10" @click="isSimulatorShow = true">
        <album-cover
          :src="song.cover"
          style="width: 30%; max-width: 200px; border-radius: 1rem"
        />
      </v-row>
      <v-row justify="center" class="mt-12">
        <h1 class="text-h4 primary--text">{{ song.name }}</h1>
      </v-row>
      <v-row class="mt-8">
        <!-- <v-progress-linear
          rounded
          :value="(currentTime / trackDuration) * 100"
        ></v-progress-linear> -->
        <v-slider
          :value="sliderTimeValue"
          :max="trackDuration"
          thumb-label
          hide-details
          @start="isSkipping = true"
          @end="skipTo"
        >
          <template v-slot:thumb-label="{ value }">
            {{ value | fancyTimeFormat }}
          </template>
        </v-slider>
      </v-row>
      <v-row class="mt-4" justify="space-between">
        <span>{{ currentTime | fancyTimeFormat }}</span>
        <span v-if="trackDuration < 10000">
          {{ trackDuration | fancyTimeFormat }}</span
        >
      </v-row>
      <v-row>
        <midi-player
          ref="midiPlayer"
          v-if="song && song.midiUrl"
          :midiUrl="song.midiUrl"
          :speed="playBackSpeed"
          @playingNote="processNote"
          @fileLoaded="midiLoading = false"
        />
      </v-row>
      <audio ref="audios" :src="audioFile"></audio>
      <audio ref="audio" :src="audioFile"></audio>
      <v-card  class="bottom-panel">
        <v-row justify="center" class="mt-8">
          <v-btn
            elevation="2"
            v-if="!isPlaying"
            color="primaryVariant"
            fab
            absolute
            top
            dark
            large
            @click="play()"
          >
            <v-icon large>mdi-play</v-icon>
          </v-btn>
          <v-btn
            elevation="2"
            v-else
            color="primaryVariant"
            dark
            fab
            absolute
            top
            large
            @click="pause()"
          >
            <v-icon large>mdi-pause</v-icon>
          </v-btn>
        </v-row>
        <v-row align="center" class="ma-12">
          <v-col cols="12" sm="6">
            <v-row justify="center" class="justify-sm-start">
              <level-selector @selected="changeLevel" />
            </v-row>
          </v-col>
          <v-col cols="12" sm="6">
            <v-row justify="center" class="justify-sm-end pt-1 pt-sm-0 ma-0">
              <speed-selector @speed="adjustSpeed" />
              <volume class="ml-4" @adjust="adjustVolume" />
            </v-row>
          </v-col>
        </v-row>
          <v-card>
          <v-container class="pa-8">
            <v-row justify="center" class="mb-4">
              <v-col class="charcoal--text text-h4 text-center"
                >Band Simulator</v-col
              >
            </v-row>
            <v-row justify="center"> 
              <v-row
                class="device-simulator ma-3"
                :class="{ [device.color]: device.color }"
                justify="center"
                align="center"
                v-for="device in simulatorDevices"
                :key="device.id"
              >
                <div class="text-center">
                  <span>{{ device.title }}</span
                  ><br />
                  <span class="text-caption">{{ device.id }}</span>
                </div>
              </v-row>
            </v-row>
            <v-row justify="center" style="display: none">
              <v-switch
                v-model="simulateResponse"
                label="จำลองการเขย่า"
              ></v-switch>
            </v-row>
            <v-row justify="center">
              <v-switch
                v-model="showYellowSignal"
                label="แสดงไฟเหลือง"
              ></v-switch>
            </v-row>
            <v-row class="mt-0" justify="center" style="display: none">
              <span class="caption shadow--text"
                >(หากเปิดโหมดจำลองการเขย่า จะไม่สามารถบันทึกข้อมูลจริงได้)</span
              >
            </v-row>
          </v-container>
        </v-card>
      </v-card>
      <v-dialog v-model="midiLoading" persistent width="300">
        <v-card class="pa-8">
          <v-container>
            <v-row>
              <v-progress-circular class="mr-8" color="primary" indeterminate />
              <span v-if="midiLoading">กำลังโหลด midi</span>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
      <end-dialog
        v-model="isEnd"
        @newGame="$router.push({ name: 'pickSong' })"
        @replay="replay"
        @menu="$router.replace({ name: 'home' })"
      />
    </v-container>
    <!-- <v-dialog v-model="isSimulatorShow" max-width="600px"> -->
      <!-- <v-card>
        <v-container class="pa-8">
          <v-row justify="center" class="mb-4">
            <v-col class="charcoal--text text-h4 text-center"
              >Band Simulator</v-col
            >
          </v-row>
          <v-row justify="center"> 
            <v-row
              class="device-simulator ma-3"
              :class="{ [device.color]: device.color }"
              justify="center"
              align="center"
              v-for="device in simulatorDevices"
              :key="device.id"
            >
              <div class="text-center">
                <span>{{ device.title }}</span
                ><br />
                <span class="text-caption">{{ device.id }}</span>
              </div>
            </v-row>
          </v-row>
          <v-row justify="center" style="display: none">
            <v-switch
              v-model="simulateResponse"
              label="จำลองการเขย่า"
            ></v-switch>
          </v-row>
          <v-row justify="center">
            <v-switch
              v-model="showYellowSignal"
              label="แสดงไฟเหลือง"
            ></v-switch>
          </v-row>
          <v-row class="mt-0" justify="center" style="display: none">
            <span class="caption shadow--text"
              >(หากเปิดโหมดจำลองการเขย่า จะไม่สามารถบันทึกข้อมูลจริงได้)</span
            >
          </v-row>
        </v-container>
      </v-card> -->
    <!-- </v-dialog> -->
  </div>
</template>
<script>
import { mapState } from "vuex";
import MidiPlayer from "@/components/MidiPlayer";
import {
  BLINK_DEVICE,
  RESET_LOG,
  FETCH_SONG,
  SELECT_LEVEL,
  SELECT_SONG,
  SUBSCRIBE_DEVICE_UPDATE,
  UNSUBSCRIBE_DEVICE_UPDATE,
  SIMULATE_RESPONSE,
  ERROR,
} from "@/store/actions.type";
import SpeedSelector from "@/components/SpeedSelector";
import playMixin from "@/mixins/play";
import AlbumCover from "@/components/AlbumCover";
import Volume from "@/components/Volume";
import LevelSelector from "@/components/LevelSelector";
import EndDialog from "@/components/EndDialog";
import ProgressStep from "@/components/ProgressStep";
// const AudioContext = window.AudioContext || window.webkitAudioContext;
// const ac = new AudioContext();

let logEvents = [];

const DELAY_TIME = 1000;

function displaySecInTimeFormat(s) {
  return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
}

export default {
  components: {
    MidiPlayer,
    SpeedSelector,
    AlbumCover,
    ProgressStep,
    Volume,
    LevelSelector,
    EndDialog,
  },
  mixins: [playMixin],
  computed: {
    ...mapState({
      song: (state) => state.play.song,
      midiPath: (state) => state.play.midiPath,
      devices: (state) => state.device.devices,
    }),
  },
  watch: {
    currentTime() {
      this.currentTime = Math.round(this.currentTime);
      if (!this.isSkipping) {
        this.sliderTimeValue = this.currentTime;
      }
    },
    simulateResponse() {
      this.$store.dispatch(SIMULATE_RESPONSE, this.simulateResponse);
    },
    showYellowSignal(value) {
      logEvents.push({
        name: "yellowLightMode",
        value,
      });
    },
  },
  data() {
    return {
      audio: "",
      isPlaying: false,
      currentTime: 0,
      sliderTimeValue: 0,
      checkingCurrentPositionInTrack: "",
      trackDuration: 10000,
      currentProgressBar: 0,
      audioFile: "",
      playBackSpeed: 1,
      midiLoading: true,
      isSkipping: false,
      maxOctave: 6,
      isEnd: false,
      isSimulatorShow: false,
      simulateResponse: false,
      simulatorDevices: [],
      showYellowSignal: false,
    };
  },
  async created() {
    logEvents = [];

    this.$store.dispatch(RESET_LOG);
    await this.fetch();
    await this.init();
  },
  mounted() {
    logEvents.push({
      name: "speed",
      value: `${this.playBackSpeed}X`,
      isSaved: false,
    });
  },
  filters: {
    fancyTimeFormat: function (s) {
      return displaySecInTimeFormat(s);
    },
  },
  methods: {
    async fetch() {
      const song = await this.$store.dispatch(FETCH_SONG, {
        song: this.song,
        midiPath: this.midiPath,
      });
      this.$store.dispatch(SELECT_SONG, song);
    },
    async init() {
      this.audioFile = this.song.mp3Url;
      this.$refs.audio.volume = 1;
      this.$refs.audio.addEventListener("loadeddata", () => {
        this.$refs.audio.volume = 1;
        this.trackDuration = Math.round(this.$refs.audio.duration);
      });
      this.$refs.audio.addEventListener("error", () => {
        this.$store.dispatch(ERROR, "เกิดข้อผิดพลาดในการเล่นเพลง");
      });
      this.$refs.audio.addEventListener("ended", this.handleEnded);

      const { maxOctave } = await this.analyseMidi(this.song);
      this.maxOctave = maxOctave;

      this.$store.dispatch(SUBSCRIBE_DEVICE_UPDATE);
      this.simulatorDevices = this.$store.state.device.devices;
      this.simulatorDevices = this.simulatorDevices
        .map((device) => ({
          ...device,
          color: "red",
          title: "Standby", // standby for show midi to play
        }))
        .sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    },
    play() {
      this.$refs.midiPlayer.play();

      if (this.$refs.audio.currentTime === 0) {
        setTimeout(() => {
          this.$refs.audio.play();
          this.countPlayTime();
        }, DELAY_TIME);
      } else {
        this.$refs.audio.play();
        this.countPlayTime();
      }

      this.isPlaying = true;
    },
    pause() {
      this.$refs.midiPlayer.pause();
      if (this.$refs.audio) {
        this.$refs.audio.pause();
        this.isPlaying = false;
      }
      clearTimeout(this.checkingCurrentPositionInTrack);
      this.turnOffAllHardware();
    },
    stop() {
      this.$refs.audio.pause();
      this.$refs.audio.currentTime = 0;
      clearTimeout(this.checkingCurrentPositionInTrack);
      this.isPlaying = false;
      this.currentTime = 0;
      this.$refs.midiPlayer.stop();
      this.turnOffAllHardware();
    },
    countPlayTime() {
      this.checkingCurrentPositionInTrack = setTimeout(() => {
        this.countPlayTime((this.currentTime += 1));
      }, 1000);
    },
    skipTo(value) {
      this.stop();
      this.$refs.audio.currentTime = value;
      this.currentTime = value;

      this.$refs.midiPlayer.skipToTime(
        value === 0 ? value : value + DELAY_TIME / 1000
      );

      this.isSkipping = false;
      this.play();
    },
    handleEnded() {
      this.stop();
      this.$router.replace({ name: "result" });
      // this.isEnd = true;
    },
    onImageLoaded: function () {
      this.imgLoaded = true;
    },
    reload() {
      this.$parent.$parent.reloadPlayer();
    },
    replay() {
      this.isEnd = false;
      this.reload();
    },
    changeLevel(midiPath) {
      this.$store.dispatch(SELECT_LEVEL, midiPath);
      this.stop();
      this.reload();
    },
    adjustSpeed(speed) {
      logEvents.push({
        name: "speed",
        value: `${speed}X`,
        isSaved: false,
      });

      // this.pause();

      // this.playBackSpeed = speed;

      if (this.$refs.audio) {
        this.$refs.audio.playbackRate = speed;
      }
    },
    adjustVolume(value) {
      if (this.$refs.audio) this.$refs.audio.volume = value / 100;
    },
    turnOffAllHardware() {
      setTimeout(() => {
        this.devices.forEach((device) => {
          this.blinkDevice(device.id, "red");
        });
      }, DELAY_TIME + 100);
    },
    processNote(note) {
      if (note) {
        const noteOnly = note.noteName.charAt(0);
        const octave = note.noteName.charAt(1);

        let adjustOctave = "";
        if (octave >= this.maxOctave) {
          adjustOctave = 2;
        }

        const device =
          this.devices.filter(
            (device) => device.note === `${noteOnly}${adjustOctave}`
          )[0] || null;

        if (note.noteOn && this.showYellowSignal) {
          this.blinkDevice(device.id, "yellow"); // wait for blink
          // this.blinkDevice(device.id, "yellow", note.noteName); // wait for blink
        }

        // console.log("process log", logEvents);

        setTimeout(() => {
          if (note.noteOn) {
            this.blinkDevice(device.id, "green","claps");
            //this.blinkDevice(device.id, "green", note.noteName);
          } else {
            this.blinkDevice(device.id, "red");
            //this.blinkDevice(device.id, "red", note.noteName)
          }
        }, DELAY_TIME);
      }
    },
    blinkDevice(deviceId, color, noteName) {
      const device = this.simulatorDevices.find(
        (device) => device.id === deviceId
      );
      if (device) {
        device.color = color;
        device.title = noteName;
      }

      const payload = {
        id: deviceId,
        songTime: displaySecInTimeFormat(this.currentTime),
        timestamp: new Date().getTime(),
        state: color,
      };

      const events = logEvents.filter((event) => !event.isSaved);
      if (events && events.length > 0) {
        payload.events = events.map((event) => ({
          name: event.name,
          value: event.value,
        }));
      }

      events.forEach((event) => (event.isSaved = true));

      this.$store.dispatch(BLINK_DEVICE, payload);
    },
  },
  beforeDestroy() {
    this.$refs.audio.pause();
    this.$refs.audio.removeEventListener("ended", this.handleEnded);
    this.$refs.audio.removeEventListener("loadedmetadata", this.handleEnded);
    this.$store.dispatch(UNSUBSCRIBE_DEVICE_UPDATE);

    clearTimeout(this.checkingCurrentPositionInTrack);
  },
};
</script>
<style lang="scss">
.v-slider__track-background,
.v-slider__track-fill {
  border-radius: 4px;
}

.bottom-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 48rem;
  margin: 0 auto;
  border-bottom-left-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
}

.card-stoke {
  border: 1px solid rgb(28, 63, 82);
  box-sizing: border-box;
  border-radius: 8px;
}

.device-simulator {
  width: 100px;
  height: 100px;
  border-radius: 20%;
  color: white;
  background: #de736c;
  max-width: 100px;
  &.red {
    background: #de736c !important;
  }
  &.green {
    background: #91be6e !important;
  }
  &.yellow {
    background: #e8b73c !important;
  }
}
</style>