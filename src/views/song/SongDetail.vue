<template>
  <v-dialog v-model="dialog" persistent max-width="850">
    <v-card>
      <v-container class="pa-6">
        <v-row justify="center" class="ma-0">
          <h3 class="text-h5">
            {{ song && song.id ? "แก้ไขเพลง" : "เพิ่มเพลงใหม่" }}
          </h3>
        </v-row>

        <v-card-text class="mt-2">
          <v-container class="pa-0" fluid>
            <v-row justify="center">
              <v-col cols="12" md="6">
                <v-container>
                  <v-row justify="center">
                    <!-- <div v-if="mp3Cover" class="d-flex justify-center">
                <img style="width: 100%" class="mb-4" :src="mp3Cover" />
              </div>
              <v-responsive v-else :aspect-ratio="1/1">
                <v-row style="width: 100%; height:100%;" class="grey lighten-3 ma-0" justify="center" align="center">
                  <v-icon>mdi-music-circle-outline</v-icon>
                </v-row>
              </v-responsive> -->
                    <image-uploader
                      ref="imageUploader"
                      class="album-cover"
                      :src="
                        songDetail.cover ||
                        require('@/assets/images/image-placeholder.jpg')
                      "
                      @onFileSelected="onFileSelected"
                    />
                  </v-row>
                  <v-row justify="center" class="mt-8">
                    <span class="text-center smoke--text"
                      >ภาพปกเพลงควรมีขนาดไม่ต่ำกว่า 1024 x 1024 px</span
                    >
                  </v-row>
                  <v-row class="mt-12">
                    <v-text-field
                      color="warning"
                      background-color="placeholder"
                      v-model="songDetail.name"
                      placeholder="ชื่อเพลง"
                      filled
                    />
                  </v-row>
                </v-container>
              </v-col>
              <v-col cols="12" md="6">
                <h3 class="charcoal--text mb-2">โน้ตเพลง</h3>
                <song-manage-item
                  :song="songDetail"
                  fileKey="midiEasy"
                  icon="mdi-midi"
                  fileType=".mid"
                  placeholder="อัพโหลดไฟล์ midi ระดับง่าย"
                  @onFileSelected="file = { ...file, ...$event }"
                  @onDeleted="refresh"
                />

                <!-- <song-manage-item
                  :song="songDetail"
                  fileKey="midiMedium"
                  icon="mdi-midi"
                  fileType=".mid"
                  placeholder="อัพโหลดไฟล์ midi ระดับปานกลาง"
                  @onFileSelected="file = { ...file, ...$event }"
                  @onDeleted="refresh"
                /> -->

                <song-manage-item
                  :song="songDetail"
                  fileKey="midiHard"
                  icon="mdi-midi"
                  fileType=".mid"
                  placeholder="อัพโหลดไฟล์ midi ระดับยาก"
                  @onFileSelected="file = { ...file, ...$event }"
                  @onDeleted="refresh"
                />

                <h3 class="charcoal--text mt-6 mb-2">เพลงบรรเลงประกอบ</h3>

                <song-manage-item
                  :song="songDetail"
                  fileKey="mp3"
                  icon="mdi-file-music"
                  fileType=".mp3"
                  placeholder="อัปโหลดไฟล์เพลงประกอบ (.mp3)"
                  @onFileSelected="file = { ...file, ...$event }"
                  @onDeleted="refresh"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-row v-if="!this.statusMessage" justify="center">
          <v-col cols="12" sm="6" md="4">
            <v-btn color="primary" outlined large block @click="dismiss()">
              ยกเลิก
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-btn
              color="primary"
              large
              block
              @click="save"
              :disabled="!songDetail.name"
            >
              บันทึก
            </v-btn>
          </v-col>
        </v-row>
        <v-card-actions v-else class="py-4">
          <v-spacer />
          <v-progress-circular color="primary" indeterminate />
          <span class="ml-2">{{ statusMessage }}</span>
          <v-spacer />
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script>
import {
  FETCH_SONG_LIST,
  UPLOAD_FILE,
  UPLOAD_SONG_COVER,
  SAVE_SONG,
  ERROR,
} from "@/store/actions.type";
import { FileType } from "@/store/modules/music.module";
// import SimpleListItem from "@/components/SimpleListItem";
// import SimpleDialog from "@/components/SimpleDialog";
import ImageUploader from "@/components/ImageUploader.vue";
import { clone } from "@/utils/helper";
import SongManageItem from "./SongManageItem.vue";

export default {
  props: {
    song: {
      type: Object,
    },
  },
  components: { ImageUploader, SongManageItem },
  watch: {
    song(newVal) {
      if (newVal) {
        this.dialog = true;
        this.songDetail = clone(newVal);
        // console.log(this.songDetail);
      } else {
        this.songDetail = {};
        this.$refs.imageUploader.clear();
        this.imageToUpload = null;
        this.dialog = false;
      }
    },
  },
  data() {
    return {
      songDetail: {},
      dialog: false,
      isSaving: false,
      statusMessage: null,
      file: {},
      imageToUpload: null,
    };
  },
  methods: {
    async refresh() {
      await this.$store.dispatch(FETCH_SONG_LIST, true);
      const [updatedSongDetail] = this.$store.state.music.songs.filter(
        (item) => item.id === this.songDetail.id
      );
      this.songDetail = updatedSongDetail;
    },
    onFileSelected(file) {
      this.imageToUpload = file;
    },
    async save() {
      this.isSaving = true;
      try {
        const requestBody = {
          ...this.songDetail,
        };

        if (this.imageToUpload) {
          this.statusMessage = "กำลังอัพโหลดหน้าปก...";
          requestBody.cover = await this.$store.dispatch(
            UPLOAD_SONG_COVER,
            this.imageToUpload
          );
        }

        if (Object.keys(this.file).length > 0) {
          this.statusMessage = "กำลังอัพโหลดเพลง...";
          for (let key in this.file) {
            // console.log(this.file[key]);
            const downloadUrl = await this.$store.dispatch(UPLOAD_FILE, {
              type: key === FileType.MP3 ? "mp3" : "midi",
              file: this.file[key],
            });

            requestBody[key] = downloadUrl;
          }
        }

        // console.log("requestBody", requestBody);
        this.statusMessage = "กำลังบันทึก";

        await this.$store.dispatch(SAVE_SONG, requestBody);
        this.$emit("saved");
        this.dismiss();
      } catch (e) {
        console.error(e);
        this.isSaving = false;
        this.$store.dispatch(
          ERROR,
          "เกิดข้อผิดพลาดในการบันทึก โปรดลองอีกครั้งในภายหลัง"
        );
      }
    },
    dismiss() {
      this.statusMessage = null;
      this.isSaving = false;
      this.dialog = false;
      this.file = {};
      this.songDetail = {};
      this.$refs.imageUploader.clear();
      this.$emit("close");
    },
  },
};
</script>
<style lang="scss">
.album-cover {
  width: 90%;
  max-width: 180px;
}
</style>