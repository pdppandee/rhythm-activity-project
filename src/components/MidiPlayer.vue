<template>
  <div>
    <!-- <v-btn @click="play">Play</v-btn>
    <v-btn @click="pause">Pause</v-btn>
    <v-btn @click="stop">Stop</v-btn>
    <h5>Tempo {{ tempo }}</h5>
    <v-slider
      v-model="tempo"
      hint="Tempo"
      max="200"
      min="20"
      @end="updateTempo"
    ></v-slider> -->
    <!-- <v-progress-linear
      :value="currentTime"
      :buffer-value="songTime"
    ></v-progress-linear>  -->
    <!-- <span>{{ `${currentTimeMin}/${songTimeMin}` }}</span> -->
    <!-- <span>โน๊ต</span>
    <v-row style="height: 5rem">
      <v-col cols="2" v-for="(noteOn, key) in trackingMap" :key="key">
        <span v-if="noteOn" class="mr-4">{{ key }}</span>
      </v-col>
    </v-row> -->
  </div>
</template>
<script>
import MidiPlayer from "midi-player-js";
// import Soundfont from "soundfont-player";

// const AudioContext = window.AudioContext || window.webkitAudioContext;
// const ac = new AudioContext();

export default {
  props: {
    midiUrl: {
      type: String,
    },
    speed: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    currentTimeMin() {
      if (this.currentTime)
        return `${Math.floor(this.currentTime / 60)}:${Math.floor(
          this.currentTime % 60
        )
          .toString()
          .padStart(2, 0)}`;
      else return "0:00";
    },
    songTimeMin() {
      if (this.songTime)
        return `${Math.floor(this.songTime / 60)}:${Math.floor(
          this.songTime % 60
        )}`;
      else return null;
    },
  },
  watch: {
    // midiUrl(url) {
    //   this.init(url);
    // },
    speed() {
      console.log("MidiPlayer", this.speed)
      this.adjustSpeed();
    },
  },
  data() {
    return {
      trackingMap: [],
      player: null,
      tempo: 0,
      currentTime: 0,
      songTime: 0,
    };
  },
  async created() {
    // const instrument = await Soundfont.instrument(
    //   ac,
    //   "https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/MusyngKite/acoustic_guitar_nylon-mp3.js"
    // );

    this.player = new MidiPlayer.Player((event) => {
      let note;
      if ((!event.name || event.name === "Note on") && event.velocity > 0) {
        note = {
          noteName: event.noteName,
          noteOn: true,
        };
        this.$emit("playingNote", note);
      } else if (
        event.name === "Note off" ||
        ((!event.name || event.name === "Note on") && event.velocity === 0)
      ) {
        note = {
          noteName: event.noteName,
          noteOn: false,
        };
        this.$emit("playingNote", note);
      } else if (event.name === "Set Tempo") {
        this.tempo = event.data;
      } else {
        return;
      }

      if (note) {
        // if (note.noteOn) {
        //   instrument.play(event.noteName, ac.currentTime, {
        //     gain: event.velocity / 100,
        //   });
        // }

        this.trackingMap = {
          ...this.trackingMap,
          [note.noteName]: note.noteOn,
        };
      }
      // console.log(this.trackingMap);
    });

    this.player.on("fileLoaded", () => {
      // console.log(this.player.tempo);
      this.tempo = this.player.tempo;
      this.songTime = this.player.getSongTime();
      this.$emit("fileLoaded");
    });

    this.player.on("playing", (currentTick) => {
      this.currentTime = currentTick.tick / 1000;
    });

    this.player.on("endOfFile", () => {});

    this.init(this.midiUrl);
  },
  beforeDestroy() {
    this.player.stop();
    this.player = null;
  },
  methods: {
    init(midiUrl) {
      if (midiUrl) {
        this.readFileAsBase64(midiUrl, (base64) => {
          this.player.loadDataUri(base64);
        });
      }
    },
    readFileAsBase64(url, callback) {
      var request = new XMLHttpRequest();
      request.onload = function () {
        var file = new FileReader();
        file.onloadend = function () {
          callback(file.result);
        };
        file.readAsDataURL(request.response);
      };
      request.open("GET", url);
      request.responseType = "blob";
      request.send();
    },
    updateTempo() {
      this.player.setTempo(this.tempo);
    },
    play() {
      this.player.play();
    },
    pause() {
      this.player.pause();
    },
    stop() {
      this.currentTime = 0;
      this.player.stop();
    },
    skipToTime(second) {
      this.player.skipToTick(second * 1000);
    },
    adjustSpeed() {
      if (this.player) {
        this.pause();
        this.player.setTempo(this.tempo * this.speed);
        this.play();
      }
    },
  },
};
</script>
<style lang="">
</style>