<template>
  <v-container>
    <v-row class="px-4 py-8" justify="space-between" align="center">
      <div>
        <v-row class="ml-4">
          <img
            :class="iconChulaClass"
            style="width: 20%; max-width: 100px"
            :src="require('@/assets/images/chula-logo.png')"
          />
          <img 
            :class="iconLogoClass" 
            style="width: 50%; max-width: 100px"
            :src="require('@/assets/logo.svg')" />
        </v-row>
      </div>
      <home-button v-if="home" class="ml-6" />
      <v-menu v-else offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            class="text-body1"
            text
            v-bind="attrs"
            v-on="on"
          >
            <v-icon class="mr-2">mdi-menu</v-icon>
            เมนู
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in menus"
            :key="index"
            link
            @click="item.onClick"
          >
            <v-list-item-icon class="mr-4">
              <v-icon color="primary" v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-title class="primary--text">{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <!-- <v-col cols="6" class="hidden-sm-and-up">
        <v-row justify="end">
          <v-btn
            color="primary"
            large
            fab
            elevation="0"
            text
            @click="showMenu = !showMenu"
          >
            <v-icon> mdi-menu </v-icon>
          </v-btn>
        </v-row>
      </v-col>
      <v-col cols="12" sm="6" class="hidden-xs-only">
        <v-row justify="end">
          <v-btn
            v-if="song"
            color="primary"
            outlined
            @click="$router.push({ name: 'song' })"
          >
            <v-icon left> mdi-music-note </v-icon>
            จัดการเพลง
          </v-btn>
          <v-btn
            v-if="signOut"
            color="primary"
            outlined
            @click="logout"
            class="ml-6"
          >
            <v-icon left> mdi-login-variant </v-icon>
            ออกจากระบบ
          </v-btn>
          <home-button v-if="home" class="ml-6" />
        </v-row>
      </v-col>
      <v-col
        cols="12"
        v-if="showMenu"
        transition="scroll-y-transition"
        class="hidden-sm-and-up"
      >
        <v-btn
          v-if="song"
          color="primary"
          outlined
          block
          class="my-2"
          @click="$router.push({ name: 'song' })"
        >
          <v-icon left> mdi-music-note </v-icon>
          จัดการเพลง
        </v-btn>
        <v-btn
          v-if="signOut"
          color="primary"
          outlined
          block
          class="my-2"
          @click="logout"
        >
          <v-icon left> mdi-login-variant </v-icon>
          ออกจากระบบ
        </v-btn>
        <home-button v-if="home" class="my-2" />
      </v-col> -->
    </v-row>
    <progress-dialog v-model="isLoggingOut" message="กำลังออกจากระบบ" />
  </v-container>
</template>

<script>
import { ERROR, LOGOUT } from "@/store/actions.type";
import HomeButton from "@/components/HomeButton";
import ProgressDialog from "@/components/ProgressDialog";

export default {
  props: {
    home: Boolean,
  },
  components: {
    HomeButton,
    ProgressDialog,
  },
  computed: {
    iconChulaClass() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "mobile-chula-logo";
        default:
          return "chula-logo";
      }
    },
    iconLogoClass() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "mobile-logo";
        default:
          return "logo";
      }
    },
  },
  data() {
    return {
      isLoggingOut: false,
      menus: [
        {
          icon: "mdi-music-note",
          title: "จัดการเพลง",
          onClick: () => this.$router.push({ name: "song" }),
        },
        {
          icon: "mdi-history",
          title: "ประวัติการเล่น",
          onClick: () => this.$router.push({ name: "history" }),
        },
        {
          icon: "mdi-login-variant",
          title: "ออกจากระบบ",
          onClick: () => this.logout(),
        },
      ],
    };
  },
  methods: {
    async logout() {
      this.isLoggingOut = true;
      try {
        await this.$store.dispatch(LOGOUT);
        this.$router.push({ name: "login" });
        location.reload();
      } catch (_) {
        this.$store.dispatch(ERROR, "เกิดข้อผิดพลาด โปรดลองอีกครั้งภายหลัง");
        this.isLoggingOut = false;
      }
    },
  },
};
</script>

<style scoped>
.chula-logo {
  width: 64px;
  height: 96px;
  object-fit: contain;
}
.logo {
  width: 140px;
  height: 96px;
  margin-left: 24px;
}
.mobile-chula-logo {
  width: 32px;
}
.mobile-logo {
  width: 70px;
  margin-left: 8px;
}
</style>