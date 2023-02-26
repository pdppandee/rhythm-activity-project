<template>
  <div>
    <toolbar home />
    <v-container>
      <v-container>
        <v-row justify="center">
          <v-col cols="12">
            <v-row align="center" justify="center">
              <span class="text-h4">ข้อมูลผู้เล่น</span>
            </v-row>
            <v-row align="center" justify="center" class="mt-8">
              <span class="text-h5 font-weight-medium"
                >กดเพื่อดูข้อมูลผู้เล่นหรือแก้ไขข้อมูลผู้เล่น</span
              >
            </v-row>
          </v-col>
        </v-row>
        <v-row class="pt-8">
          <v-col
            cols="12"
            sm="4"
            md="3"
          >
            <avatar-tile
              title="ผู้เล่นใหม่"
              :src="require('@/assets/images/add-item-cover.svg')"
              @click="addNewUser"
              clickable
            />
          </v-col>
          <v-col
            cols="12"
            sm="4"
            md="3"
            v-for="(player, index) in players"
            :key="index"
          >
            <avatar-tile
              :title="player.name"
              :src="player.imageUrl || require('@/assets/images/user-placeholder.svg')"
              clickable
              @click="editUser(player.id)"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-container>
    <progress-dialog v-model="isLoading" message="กำลังโหลด..." />
    <user-detail-dialog v-model="userId" @onSaved="fetch(true)" @onDeleted="fetch(true)"/>
  </div>
</template>
<script>
import { mapState } from "vuex";
import {
  FETCH_PLAYER_LIST,
  // ERROR,
} from "@/store/actions.type";
import Toolbar from "@/components/Toolbar";
import AvatarTile from "@/components/AvatarTile";
import ProgressDialog from '@/components/ProgressDialog.vue';
import UserDetailDialog from "./UserDetailDialog";

export default {
  computed: {
    ...mapState({
      players: (state) => state.user.players,
    }),
  },
  components: {
    Toolbar,
    AvatarTile,
    UserDetailDialog,
    ProgressDialog
  },
  data() {
    return {
      fetching: false,
      userId: null,
      isLoading: false,
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch(force = false) {
      this.isLoading = true
      await this.$store.dispatch(FETCH_PLAYER_LIST, force);
      // console.log(JSON.stringify(this.players))
      this.isLoading = false
    },
    addNewUser() {
      this.userId = "new"
    },
    editUser(userId) {
      this.userId = userId
    },
  },
};
</script>
<style lang="">
</style>