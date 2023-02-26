<template>
  <div>
    <v-container v-if="isDeleting" class="my-3">
      <v-row justify="center" align="center">
        <v-progress-circular :size="16" indeterminate color="primary" />
        <span class="ml-2">กำลังลบ mp3</span>
      </v-row>
    </v-container>
    <simple-list-item
      v-else-if="url"
      :avatarIcon="icon"
      :text="url | filterLastPath"
      actionIcon="mdi-delete-outline"
      @click="shouldShowDeleteDialog = true"
    />
    <v-file-input
      v-else
      v-model="file"
      color="warning"
      background-color="placeholder"
      show-size
      :label="placeholder"
      filled
      @change="fileSelected"
      :prepend-icon="null"
      :prepend-inner-icon="icon"
      :accept="fileType"
    />
    <simple-dialog
      alert
      v-model="shouldShowDeleteDialog"
      title="ยืนยันการลบ"
      :message="`คุณต้องการจะลบไฟล์ ${showLastPath(url)} ใช่หรือไม่`"
      positiveMessage="ใช่ ลบไฟล์"
      negativeMessage="ยกเลิก"
      @positive="deleteFile"
    />
  </div>
</template>

<script>
import SimpleDialog from "@/components/SimpleDialog";
import SimpleListItem from "@/components/SimpleListItem";
import { DELETE_MUSIC_FILE, ERROR } from "@/store/actions.type";

function calcualteLastPath(url) {
      if (url) {
        const paths = url.split("/");
        let lastPath = paths[paths.length - 1];
        if (lastPath.length > 14) {
          lastPath = lastPath.substr(14, lastPath.length - 1);
        }
        return lastPath;
      }
      return url;
    }

export default {
  props: {
    song: Object,
    fileType: String,
    icon: String,
    placeholder: String,
    fileKey: String,
  },
  watch: {
    song() {
      // console.log("song", this.song[this.fileKey])
      this.url = this.song[this.fileKey];
    },
  },
  data() {
    return {
      url: this.song && this.song[this.fileKey],
      isDeleting: false,
      shouldShowDeleteDialog: false,
      file: null,
    };
  },
  components: { SimpleDialog, SimpleListItem },
  filters: {
    filterLastPath(url) {
      return calcualteLastPath(url);
    },
  },
  methods: {
    fileSelected(file) {
      this.$emit("onFileSelected", { [this.fileKey]: file });
    },
    showLastPath(url) {
      return calcualteLastPath(url)
    },
    async deleteFile() {
      try {
        this.isDeleting = true;
        await this.$store.dispatch(DELETE_MUSIC_FILE, {
          song: this.song,
          field: this.fileKey,
        });
        this.url = null;
        this.$emit("onDeleted");
      } catch (e) {
        console.error(e);
        this.$store.dispatch(
          ERROR,
          "เกิดข้อผิดพลาดในการบันทึก โปรดลองอีกครั้งในภายหลัง"
        );
      } finally {
        this.isDeleting = false;
      }
    },
  },
};
</script>

<style>
</style>