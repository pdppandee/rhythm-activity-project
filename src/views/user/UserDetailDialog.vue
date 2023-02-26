<template>
  <v-dialog :value="dialog" :max-width="maxWidth" @input="$emit('input', null)">
    <v-card>
      <v-container class="pa-8" v-if="user && !isLoading">
        <v-row justify="center" class="ma-0">
          <h3 class="text-h5">เพิ่มข้อมูลผู้เล่นใหม่</h3>
        </v-row>
        <v-row justify="center" class="mt-8">
          <image-uploader
            class="profile-image"
            :src="
              user.imageUrl || require('@/assets/images/user-placeholder.svg')
            "
            camera
            @onFileSelected="onFileSelected"
          />
        </v-row>
        <v-row justify="center" class="mt-15">
          <v-text-field
            placeholder="ชื่อเล่น *"
            block
            filled
            v-model="user.name"
          />
        </v-row>
        <v-row>
          <v-col cols="12" sm="6">
            <v-btn
              v-if="user.id"
              color="error"
              outlined
              large
              block
              @click="deleteUser(user)"
            >
              ลบผู้เล่น
            </v-btn>
            <v-btn
              v-else
              color="primary"
              outlined
              large
              block
              @click="dismiss()"
            >
              ยกเลิก
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6">
            <v-btn color="primary" large block @click="save"> บันทึก </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-else class="px-8 py-12">
        <v-row justify="center">
          <v-progress-circular indeterminate color="primary" />
          <h5 class="text-h5 font-weight-regular ml-4">
            {{ loadingMeassage }}
          </h5>
        </v-row>
      </v-container>
    </v-card>
    <simple-dialog
      alert
      v-model="userToBeDeleted"
      message="คุณต้องการที่จะลบผู้เล่นคนนี้ใช่หรือไม่"
      negativeMessage="ยกเลิก"
      positiveMessage="ใช่  ลบผู้เล่น"
      @positive="confirmDeleteUser"
    />
  </v-dialog>
</template>
<script>
import {
  GET_PLAYER_BY_ID,
  ERROR,
  CREATE_PLAYER,
  UPDATE_PLAYER,
  DELETE_PLAYER,
  UPLOAD_PROFILE_IMAGE,
} from "@/store/actions.type";
import ImageUploader from "../../components/ImageUploader.vue";
import SimpleDialog from "../../components/SimpleDialog.vue";

function createNewUser() {
  return {
    id: null,
    imageUrl: null,
    name: null,
  };
}

export default {
  components: { ImageUploader, SimpleDialog },
  props: {
    value: null,
    message: null,
    negativeMessage: null,
    positiveMessage: null,
    maxWidth: {
      default: 470,
    },
  },
  watch: {
    value(playerId) {
      // console.log(playerId);
      this.dialog = playerId !== null;
      if (playerId === "new") {
        this.user = createNewUser();
        this.fileToUpload = null;
      } else {
        this.fetchUser(playerId);
      }
    },
  },
  data() {
    return {
      dialog: false,
      isLoading: false,
      loadingMeassage: "กำลังโหลด",
      userToBeDeleted: null,
      user: createNewUser(),
      fileToUpload: null,
    };
  },
  methods: {
    async fetchUser(playerId) {
      this.showLoading("กำลังโหลด");
      this.user = await this.$store.dispatch(GET_PLAYER_BY_ID, { playerId });
      this.hideLoading();
    },
    deleteUser(user) {
      this.userToBeDeleted = user;
    },
    dismiss() {
      this.$emit("input", null);
      this.dialog = null;
    },
    async confirmDeleteUser() {
      this.showLoading("กำลังลบผู้เล่น");
      try {
        await this.$store.dispatch(DELETE_PLAYER, this.userToBeDeleted);
        this.dismiss();
        this.$emit("onDeleted");
      } catch (_) {
        this.$store.dispatch(ERROR, "เกิดข้อผิดพลาด");
      } finally {
        this.hideLoading();
      }
    },
    async save() {
      // Is there a file to upload?
      if (!this.user.name) {
        this.$store.dispatch(ERROR, `กรุณาระบุชื่อสมาชิก`);
        return;
      }

      let imageUrl = null;
      if (this.fileToUpload) {
        imageUrl = await this.uploadImage(this.fileToUpload);
      }
      const user = { ...this.user, imageUrl };
      this.showLoading("กำลังบันทึก");
      try {
        // checking for a new user
        if (this.user.id) {
          await this.$store.dispatch(UPDATE_PLAYER, user);
        } else {
          await this.$store.dispatch(CREATE_PLAYER, user);
        }
        this.dismiss();
        this.$emit("onSaved");
      } catch (e) {
        this.$store.dispatch(ERROR, `เกิดข้อผิดพลาด : ${e}`);
      } finally {
        this.hideLoading();
      }
    },
    async uploadImage(file) {
      this.showLoading("กำลังอัพโหลดภาพ");
      try {
        return await this.$store.dispatch(UPLOAD_PROFILE_IMAGE, file);
      } catch (e) {
        this.$store.dispatch(ERROR, `อัพโหลดภาพล้มเหลว : ${e}`);
      } finally {
        this.hideLoading();
      }
      return null;
    },
    showLoading(message) {
      this.isLoading = true;
      this.loadingMeassage = message;
    },
    hideLoading() {
      this.isLoading = false;
    },
    onFileSelected(file) {
      this.fileToUpload = file;
    },
  },
};
</script>
<style scoped>
.profile-image {
  width: 80%;
  max-width: 10rem;
}
</style>