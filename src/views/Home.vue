<template>
  <div>
    <toolbar />
    <!-- <v-btn @click="fetchDevices">Fetch devices</v-btn>
    <v-btn @click="addDevices">Add devices</v-btn> -->
    <!-- <v-btn @click="addLogs">Add Logs</v-btn>
    <v-btn @click="addPlayers">Add Players</v-btn> -->
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-row align="center" justify="center">
            <span class="text-h5 font-weight-medium">วงดนตรีอังกะลุงอัจริยะ</span>
          </v-row>
          <v-row align="center" justify="center" class="pt-4 pb-8">
            <span class="text-h4" v-if="this.account">{{this.account.name}}</span>
          </v-row>
        </v-col>
        <v-col
          cols="12"
          sm="4"
          md="3"
          lg="2"
          v-for="(item, index) in menu"
          :key="index"
        >
          <menu-tile
            :src="item.icon"
            :title="item.title"
            :color="item.color"
            :background="item.background"
            @onClick="item.onClick"
          />
          <!-- <v-card>
          <v-card-text>
            <img class="menu-logo pa-8" :src="item.icon" />
          </v-card-text>
          <v-card-actions class="pa-0">
            <v-btn
              large
              block
              class="primary--text bottom-menu-button"
              color="secondary"
              @click="item.onClick"
              >{{ item.title }}</v-btn
            >
          </v-card-actions>
        </v-card> -->
        </v-col>
      </v-row>
      <v-row class="mt-8 pa-4 credit text-body1 text-center hidden-sm-and-up">
        <div>
          © 2564 ศูนย์ปฏิบัติการศิลปกรรมดิจิทัล คณะศิลปกรรมศาสตร์
          จุฬาลงกรณ์มหาวิทยาลัย เจ้าของลิขสิทธิ์
        </div>
      </v-row>
    </v-container>

    <div class="credit float text-body1 text-center hidden-xs-only">
      © 2564 ศูนย์ปฏิบัติการศิลปกรรมดิจิทัล คณะศิลปกรรมศาสตร์
      จุฬาลงกรณ์มหาวิทยาลัย เจ้าของลิขสิทธิ์
      <div class="text-caption">v1.0.10</div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  FETCH_ACCOUNT_LIST,
  FETCH_DEVICE_LIST,
  LOGIN,
  ERROR,
  ADD_DEVICE,
  ADD_LOGS,
  ADD_PLAYERS,
} from "@/store/actions.type";
import angklung from "@/assets/images/angklung-tile.svg";
import team from "@/assets/images/team-tile.svg";
import MenuTile from "@/components/MenuTile.vue";
import Toolbar from "@/components/Toolbar.vue";

export default {
  components: { MenuTile, Toolbar },
  computed: {
    iconMusic: () => require("@/assets/images/music.svg"),
    iconFile: () => require("@/assets/images/file.svg"),
    iconGroup: () => require("@/assets/images/group.svg"),
    ...mapGetters(["account"]),
  },
  data() {
    return {
      menu: [
        {
          icon: angklung,
          title: "เล่นอังกะลุง",
          color: "grey--text text--darken-4",
          background: "secondary",
          onClick: () => this.$router.push({ name: "pickBand" }),
        },
        {
          icon: team,
          title: "จัดการข้อมูลผู้เล่น",
          color: "grey--text text--darken-4",
          background: "accent",
          onClick: () => this.$router.push({ name: "user" }),
        },
      ],
    };
  },
  methods: {
    async fetch() {
      this.accounts = await this.$store.dispatch(FETCH_ACCOUNT_LIST);
    },
    login() {
      if (this.accounts && this.selectedAccount && this.pin) {
        const account = this.accounts.filter(
          (account) => account.id === this.selectedAccount
        );
        if (account[0] && account[0].pin == this.pin) {
          this.$store.dispatch(LOGIN, account[0]);
          return;
        } else {
          this.$store.dispatch(ERROR, "pin ไม่ถูกต้อง");
        }
      }
    },
    success() {},
    async fetchDevices() {
      const devices = await this.$store.dispatch(FETCH_DEVICE_LIST);
      console.log(devices);
    },
    async addDevices() {
      const devices = await this.$store.dispatch(FETCH_DEVICE_LIST);
      console.log(devices);
      if (devices && devices.length > 0) {
        await Promise.all(
          devices.map((device) => this.$store.dispatch(ADD_DEVICE, device))
        );
        console.log("Done");
      }
    },
    async addLogs() {
      const logs = [];
      await this.$store.dispatch(ADD_LOGS, logs);
      console.log("Done");
    },
    async addPlayers() {
      const players = [
        {
          imageUrl:
            "https://firebasestorage.googleapis.com/v0/b/smart-angklung.appspot.com/o/images%2Fplayers%2F1628057067651_image.jpg?alt=media&token=01595745-31ea-4a59-818e-af0ebf6bf7c6",
          updatedAt: { seconds: 1628057084, nanoseconds: 961000000 },
          id: "b6341e49-ba5e-440c-b4c5-f61b8ceed534",
          name: null,
          createdAt: { seconds: 1628057037, nanoseconds: 357000000 },
        },
        {
          createdAt: { seconds: 1628056749, nanoseconds: 349000000 },
          updatedAt: { seconds: 1628056749, nanoseconds: 350000000 },
          imageUrl:
            "https://firebasestorage.googleapis.com/v0/b/smart-angklung.appspot.com/o/images%2Fplayers%2F1628056734759_image.jpg?alt=media&token=553a2e1f-3729-4ece-91d2-d996e14f1dfc",
          id: "7835fa68-8ea9-452c-b2b1-a43d61659847",
          name: "คุณยายวันดี",
        },
        {
          createdAt: { seconds: 1628056710, nanoseconds: 615000000 },
          updatedAt: { seconds: 1628056710, nanoseconds: 617000000 },
          id: "fdd4a1d7-026b-4485-b1ec-1beb4db91de0",
          imageUrl:
            "https://firebasestorage.googleapis.com/v0/b/smart-angklung.appspot.com/o/images%2Fplayers%2F1628056699546_image.jpg?alt=media&token=87312988-6da5-444b-9287-58bc03158127",
          name: "คุณยายเปลี่ยน",
        },
        {
          name: "คุณยายเสาวลักษณ์",
          imageUrl:
            "https://firebasestorage.googleapis.com/v0/b/smart-angklung.appspot.com/o/images%2Fplayers%2F1628056655114_image.jpg?alt=media&token=585aa800-28f4-4518-8f21-9cf00da0fcf2",
          updatedAt: { seconds: 1628056672, nanoseconds: 63000000 },
          createdAt: { seconds: 1628056672, nanoseconds: 61000000 },
          id: "450cd208-1789-41fb-882a-ca392c36d472",
        },
        {
          updatedAt: { seconds: 1628056626, nanoseconds: 553000000 },
          id: "5c8ae81b-a8ef-469d-b600-2dd9da8d4c43",
          name: "คุณยายตรงลักษณ์",
          createdAt: { seconds: 1628056626, nanoseconds: 552000000 },
          imageUrl:
            "https://firebasestorage.googleapis.com/v0/b/smart-angklung.appspot.com/o/images%2Fplayers%2F1628056601991_image.jpg?alt=media&token=a7730a54-a491-42a6-af39-e5bba9f6a107",
        },
        {
          name: "คุณยายซุ่ยเต็ก",
          updatedAt: { seconds: 1628056566, nanoseconds: 154000000 },
          id: "25216cdf-07ac-41d9-81a5-21578da01a56",
          imageUrl:
            "https://firebasestorage.googleapis.com/v0/b/smart-angklung.appspot.com/o/images%2Fplayers%2F1628056546803_image.jpg?alt=media&token=9435db93-8e06-4249-b9cf-3cd3d09636ed",
          createdAt: { seconds: 1628056566, nanoseconds: 152000000 },
        },
        {
          imageUrl:
            "https://firebasestorage.googleapis.com/v0/b/smart-angklung.appspot.com/o/images%2Fplayers%2F1628049473688_image.jpg?alt=media&token=a2d463c1-0099-4e22-823a-3fe72deea728",
          createdAt: { seconds: 1628049486, nanoseconds: 367000000 },
          id: "1c8c69bb-c31c-42aa-8ea6-d3be35a1d350",
          name: "คุณยายเปี่ยมสุขข",
          updatedAt: { seconds: 1628049486, nanoseconds: 369000000 },
        },
        {
          id: "3edf454a-d1d3-494a-b0f9-5849886aa752",
          imageUrl:
            "https://firebasestorage.googleapis.com/v0/b/smart-angklung.appspot.com/o/images%2Fplayers%2F1628049425469_image.jpg?alt=media&token=5db9dc64-83a1-4a1f-991a-79fde323af59",
          updatedAt: { seconds: 1628049439, nanoseconds: 933000000 },
          name: "คุณยายห้วย",
          createdAt: { seconds: 1628049439, nanoseconds: 931000000 },
        },
        {
          id: "ec8e7a44-464e-4565-a00d-c7314c1b6b1a",
          name: "คุณยายทองมี",
          createdAt: { seconds: 1628049275, nanoseconds: 385000000 },
          updatedAt: { seconds: 1628049275, nanoseconds: 386000000 },
          imageUrl:
            "https://firebasestorage.googleapis.com/v0/b/smart-angklung.appspot.com/o/images%2Fplayers%2F1628049254845_image.jpg?alt=media&token=a398c285-7bdd-4472-96d0-f02e27738798",
        },
        {
          name: "คุณยายรัตนกร",
          imageUrl:
            "https://firebasestorage.googleapis.com/v0/b/smart-angklung.appspot.com/o/images%2Fplayers%2F1628049209991_image.jpg?alt=media&token=623929a6-f0f7-42cb-9e82-ca964e320de2",
          updatedAt: { seconds: 1628049224, nanoseconds: 678000000 },
          createdAt: { seconds: 1628049224, nanoseconds: 676000000 },
          id: "79c0947d-a477-4cb2-9f5c-2b9c6fb9b800",
        },
        {
          createdAt: { seconds: 1628049173, nanoseconds: 953000000 },
          id: "adb0c021-157b-4688-a9f3-f95a37515f32",
          name: "คุณยายบัวคลี่",
          imageUrl:
            "https://firebasestorage.googleapis.com/v0/b/smart-angklung.appspot.com/o/images%2Fplayers%2F1628049155713_image.jpg?alt=media&token=f616e21d-b701-41b2-adff-172471a8ab7d",
          updatedAt: { seconds: 1628049173, nanoseconds: 955000000 },
        },
        {
          name: "คุณยายแดง",
          updatedAt: { seconds: 1628049119, nanoseconds: 244000000 },
          id: "9a068d6d-2ab2-4cda-a914-5f5bca900c26",
          imageUrl:
            "https://firebasestorage.googleapis.com/v0/b/smart-angklung.appspot.com/o/images%2Fplayers%2F1628049104734_image.jpg?alt=media&token=1a7539db-22ea-4a13-bdf9-e0c1f43dccc1",
          createdAt: { seconds: 1628049119, nanoseconds: 242000000 },
        },
      ];
      await this.$store.dispatch(ADD_PLAYERS, players);
      console.log("Done");
    },
  },
};
</script>
<style lang="scss" scoped>
.credit {
  color: #999790;
  &.float {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 100%;
    margin-bottom: 24px;
    transform: translate(-50%, -51%);
  }
}
</style>