<template>
  <v-container class="px-8">
    <v-alert v-if="isOffline" prominent type="error">
      <v-row align="center">
        <v-col class="grow">
          กรุณาตรวจสอบอินเตอร์เน็ต และรีเฟรชหน้าเว็ปอีกครั้ง
        </v-col>
        <v-col class="shrink">
          <v-btn @click="reload" class="error--text" color="white"
            >รีเฟรช</v-btn
          >
        </v-col>
      </v-row>
    </v-alert>

    <progress-step :step="4" />
    <v-row class="my-4" justify="center">
      <h1 class="primary--text text-center px-4">
        ขั้นตอนที่ 4: เตรียมอุปกรณ์ให้พร้อม
      </h1>
    </v-row>
    <v-row justify="end" style="display: none;">
      <v-switch v-model="showLog" label="แสดง Log"></v-switch>
    </v-row>
    <v-card
      class="primary"
      v-if="showLog"
      style="
        width: 50vw;
        position: fixed;
        top: 0;
        margin-top: 2rem;
        z-index: 1000;
        height: 90vh;
        overflow-y: auto;
      "
    >
      <v-card-text class="white--text">
        <h2>Log</h2>
        <div v-for="(records, key) in log" :key="key" class="mt-2">
          {{ key }}:
          <v-card>
            <v-card-text>
              <span
                v-for="(record, index) in records"
                :key="index"
                class="mr-2"
              >
                <template v-if="record.requestTimestamp">
                  {{ record | timeDiff }}
                </template>
                <template v-if="record.events && record.events.length > 0">
                  <span
                    v-for="(event, index) in record.events"
                    :key="index"
                    style="color: red"
                  >
                    {{ `${event.name}: ${event.value} ` }}
                  </span>
                </template>
              </span>
            </v-card-text>
          </v-card>
        </div>
      </v-card-text>
    </v-card>
    <v-row>
      <v-col
        cols="12"
        :md="player.devices && player.devices.length > 1 ? 12 : 6"
        v-for="(player, index) in playerSortedByDeviceCount"
        :key="index"
      >
        <v-card
          v-if="player.devices && player.devices.length > 0"
          class="elevation-0 offlinebg lighten-3 mb-4"
          :class="{
            onlinebg: isEveryDeviceOnline(player.devices),
          }"
          style="width: 100%"
        >
          <v-card
            class="elevation-0 restrict-device"
            v-if="shouldDisablePlayerTile(player.devices)"
          >
            <h1 class="error--text text-center pa-4 text-h5">
              หยุดเล่น อุปกรณ์ชุดที่ {{ player.devices[0].number }} ในเพลงนี้
            </h1>
          </v-card>

          <v-container class="pa-6">
            <v-row class="ma-0">
              <avatar-tile
                :style="`width: ${player.devices.length > 1 ? '21%' : '45%'}`"
                :title="player.name"
                :src="player.imageUrl"
              />
              <v-row
                class="pa-0 ma-0"
                justify="center"
                align="center"
                :style="`min-width: ${
                  player.devices.length > 1 ? '5%' : '10%'
                }; max-width: ${player.devices.length > 1 ? '5%' : '10%'};`"
              >
                <img :src="arrowRight" />
              </v-row>
              <device-tile
                v-for="(device, index) in player.devices"
                :key="device.id"
                :style="`width: ${player.devices.length > 1 ? '21%' : '45%'}`"
                :class="{ 'ml-4': index >= 1 }"
                clickable
                :disabled="shouldDisableDeviceTile(player.devices, device)"
                @click="blinkDevice(device)"
                :title="`อุปกรณ์ชุดที่ ${device.number}`"
                :statusShaker="
                  isDeviceOnline(getUpdatedDevice(device.id)) ? 1 : 0
                "
                :statusDetector="
                  isDeviceOnline(getUpdatedDevice(device.id)) ? 1 : 0
                "
              />
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="my-8 mx-0" justify="center">
      <v-btn large block color="primary" @click="launchPlayer()"
        >เริ่มเล่นอังกะลุง</v-btn
      >
    </v-row>
    <simple-dialog
      alert
      v-model="shouldShowNotReadyDevice"
      title="พบอุปกรณ์ไม่พร้อมใช้งาน"
      message="กรุณาตรวจสอบอุปกรณ์ว่าเปิดพร้อมใช้งานและมีแบตเตอรี่เหลือเพียงพอ ก่อนเริ่มเล่นอังกะลุง"
      negativeMessage="ข้าม"
      positiveMessage="ตกลง"
      @negative="launchPlayer(true)"
    />
    <v-dialog v-model="midiLoading" persistent width="300">
      <v-card class="pa-8">
        <v-container>
          <v-row align="center">
            <v-progress-circular class="mr-8" color="primary" indeterminate />
            <span v-if="midiLoading">กำลังโหลด midi</span>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import ProgressStep from "@/components/ProgressStep";
import AvatarTile from "@/components/AvatarTile";
import DeviceTile from "@/components/DeviceTile";
import SimpleDialog from "@/components/SimpleDialog";
import {
  FETCH_DEVICE_LIST,
  UPDATE_DEVICE_STATUS,
  BLINK_DEVICE,
  PING,
  SUBSCRIBE_DEVICE_UPDATE,
  UNSUBSCRIBE_DEVICE_UPDATE,
  RESET_LOG,
  RESET_DEVICE_PING,
  FETCH_SONG,
  SELECT_SONG,
  SELECT_PLAYERS,
} from "@/store/actions.type";
import playMixin from "@/mixins/play";
import arrowRight from "@/assets/images/arrow-right.svg";

let pingInterval = null;

export default {
  components: { ProgressStep, AvatarTile, DeviceTile, SimpleDialog },
  computed: {
    ...mapState({
      song: (state) => state.play.song,
      midiPath: (state) => state.play.midiPath,
      players: (state) => state.play.players,
      log: (state) => {
        return state.play.log;
      },
    }),
    ...mapGetters({
      devices: "devicesPing",
      playerSortedByDeviceCount: "playerSortedByDeviceCount",
    }),
    arrowRight: () => arrowRight,
  },
  mixins: [playMixin],
  data() {
    return {
      showLog: false,
      midiLoading: false,
      isOffline: false,
      shouldShowNotReadyDevice: false,
      availableNotes: {},
    };
  },
  async mounted() {
    window.addEventListener("offline", () => (this.isOffline = true));

    this.$store.dispatch(RESET_LOG);
    this.$store.dispatch(RESET_DEVICE_PING);

    await this.fetchDevice();
    await this.fetchSong();
    await this.calculateAvailableNotes();
    if (this.players && this.players.length > 0 && !this.players[0].devices) {
      await this.assignDeviceToPlayers();
    } else {
      await this.reassignAvailableDeviceToPlayers();
    }
  },
  filters: {
    timeDiff(device) {
      const requestTimestamp = parseInt(device.requestTimestamp);
      const responseTimestamp = parseInt(device.responseTimestamp);
      if (!isNaN(requestTimestamp) && !isNaN(responseTimestamp)) {
        return `${responseTimestamp - requestTimestamp}ms`;
      }
      return "waiting...";
    },
  },
  beforeDestroy() {
    if (pingInterval) {
      console.log("clearInterval", "pingInterval");
      clearInterval(pingInterval);
    }
  },
  methods: {
    async fetchDevice() {
      await this.$store.dispatch(FETCH_DEVICE_LIST);

      this.devicePingTest(this.devices);
      pingInterval = setInterval(() => {
        this.devicePingTest(this.devices);
      }, 5000);
    },
    async fetchSong() {
      this.midiLoading = true;
      const song = await this.$store.dispatch(FETCH_SONG, {
        song: this.song,
        midiPath: this.midiPath,
      });
      this.$store.dispatch(SELECT_SONG, song);
      this.midiLoading = false;
    },
     //TODO: edit here
    async calculateAvailableNotes() {
      const midiDetail = await this.analyseMidi(this.song);

      const availableNotes = {}; 
      midiDetail.notes.forEach((note) => {
        const key = `${note.pitch}${
          note.octave >= midiDetail.maxOctave ? "2" : ""
        }`;
        availableNotes[key] = true;
      });

      this.availableNotes = availableNotes;
    },
    async assignDeviceToPlayers() {
      if (
        this.players &&
        this.devices &&
        this.players.length <= this.devices.length
      ) {
        console.log("available note" , Object.keys(this.availableNotes)); //(7)['C', 'C2', 'D', 'G', 'E', 'A', 'B']
        console.log(
          "before sort",
          this.devices.map((d) => d.note)
        );

        const sortedAvailbleNoteDevice = this.devices
          .sort(() => 0.5 - Math.random())
          .sort((a) => (this.availableNotes[a.note] ? -1 : 1));
        console.log(
          "after sort",
          sortedAvailbleNoteDevice.map((d) => d.note)
        );

        const playerMap = {};

        for (let i = 0; i < this.players.length; i += 1) {
          const id = this.players[i].id;
          if (!playerMap[id]) {
            playerMap[id] = { ...this.players[i], devices: [] };
          }

          playerMap[id] = {
            ...playerMap[id],
            devices: [...playerMap[id].devices, sortedAvailbleNoteDevice[i]],
          };
        }

        this.$store.dispatch(SELECT_PLAYERS, Object.values(playerMap));
      }
    },
    async reassignAvailableDeviceToPlayers() {
      let oldSequenceDevices = [];
      this.players.forEach(
        (player) =>
          (oldSequenceDevices = [...oldSequenceDevices, ...player.devices])
      );
      const unAssignedAvailableDevice = [];

      const oldSequenceDeviceNotes = oldSequenceDevices.map(
        (device) => device.note
      );
      console.log("Old Sequence Device Notes", oldSequenceDeviceNotes);
      console.log("Available Notes", Object.keys(this.availableNotes));
      Object.keys(this.availableNotes).forEach((note) => {
        if (!oldSequenceDeviceNotes.includes(note)) {
          const foundDevice = this.devices.find(
            (targetDevice) => targetDevice.note === note
          );
          unAssignedAvailableDevice.push(foundDevice);
        }
      });

      console.log(
        "Free Device",
        unAssignedAvailableDevice.map((device) => device.id)
      );

      this.players.forEach((player) => {
        player.devices.forEach((device, index) => {
          if (!Object.keys(this.availableNotes).includes(device.note)) {
            if (unAssignedAvailableDevice.length > 0) {
              console.log(
                `Replace ${device.id} with ${unAssignedAvailableDevice[0].id}`
              );
              player.devices[index] = unAssignedAvailableDevice[0];
              unAssignedAvailableDevice.splice(0, 1);
            }
          }
        });
      });

      this.$store.dispatch(SELECT_PLAYERS, this.players);
      this.$forceUpdate();
    },
    async devicePingTest(devices) {
      this.$store.dispatch(SUBSCRIBE_DEVICE_UPDATE);
      (devices || []).map((device) =>
        this.$store.dispatch(PING, {
          id: device.id,
        })
      );
    },
    setDeviceOnline(id) {
      this.$store.dispatch(UPDATE_DEVICE_STATUS, { id, status: 1 });
    },
    blinkDevice(device) { //set state to device BLINK_DEVICE contains payload 
      this.$store.dispatch(BLINK_DEVICE, {
        id: device.id,
        timestamp: new Date().getTime(),
        state: "green",
      });
      setTimeout(() => {
        this.$store.dispatch(BLINK_DEVICE, {
          id: device.id,
          timestamp: new Date().getTime(),
          state: "red",
        });
      }, 1000); //with a new state of "red". This will cause the device to blink from green to red after a delay of 1 second.
    },
    launchPlayer(force = false) {
      const notReadyDeives = this.devices
        .map((device) => device.pingShaker && device.pingDetector) // TODO: remove  device.pingShaker && 
        .filter((status) => !status); //choose not ready device
      if (notReadyDeives.length <= 0 || force) {
        this.$store.dispatch(UNSUBSCRIBE_DEVICE_UPDATE);
        this.$router.replace({ name: "player" });
      } else {
        this.shouldShowNotReadyDevice = true; //trigger alert dialog
      }
    },
    getUpdatedDevice(deviceId) { //check isDeviceOnline
      if (this.devices) {
        return this.devices.find((device) => device.id === deviceId) || {};
      }
      return {};
    },
    isDeviceOnline(device) {
      return (
        device.pingShaker !== undefined && device.pingDetector !== undefined
      );
    },
    isEveryDeviceOnline(nonUpdateDevices) {
      const deviceStatuses = nonUpdateDevices.map((nonUpdateDevice) => {
        if (this.devices) {
          const device = this.devices.find(
            (device) => device.id === nonUpdateDevice.id
          );
          return this.isDeviceOnline(device);
        }
      });
      return deviceStatuses.every((status) => status);
    },
    reload() {
      this.$parent.$parent.reload("device");
    },
    shouldDisablePlayerTile(devices) {
      if (devices.length === 1) {
        return !this.availableNotes[devices[0].note];
      }
      return devices
        .map((device) => device.note)
        .every((note) => !this.availableNotes[note]);
    },
    shouldDisableDeviceTile(devices, device) {
      if (this.shouldDisablePlayerTile(devices)) {
        return false;
      }
      return devices.length > 1 && !this.availableNotes[device.note];
    },
  },
};
</script>
<style scoped>
.long-arrow-right {
  display: block;
  margin: 30px auto;
  width: 25px;
  height: 25px;
  border-top: 2px solid #000;
  border-left: 2px solid #000;
  transform: rotate(135deg);
}

.long-arrow-right::after {
  content: "";
  display: block;
  width: 2px;
  height: 45px;
  background-color: black;
  transform: rotate(-45deg) translate(15px, 4px);
  left: 0;
  top: 0;
}

.onlinebg {
  background: #e2ece6 !important;
}

.offlinebg {
  background: #f4dcd9;
}

.restrict-device {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(237, 236, 235, 0.8);
}
</style>