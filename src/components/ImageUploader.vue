<template>
  <div style="position: relative">
    <v-row
      align="center"
      justify="center"
      class="drop ma-0 clickable"
      v-ripple
      @dragover.prevent
      @drop="onDrop"
      @click="chooseFiles"
    >
      <!-- <v-btn v-if="!image" color="primary--text white" @click="chooseFiles">
      {{ label }}
      <input
        type="file"
        ref="fileUpload"
        name="image"
        @change="onChange"
        accept="image/x-png,image/gif,image/jpeg"
      />
    </v-btn>
    <div v-else class="preview" v-bind:class="{ image: true }"> -->

      <input
        type="file"
        ref="fileUpload"
        name="image"
        @change="onChange"
        accept="image/*"
      />
      <input
        type="file"
        ref="cameraUpload"
        name="image"
        @change="onChange"
        accept="image/*"
        capture="camera"
      />
      <!-- </v-btn> -->
      <!-- <v-btn
        absolute
        light
        fab
        small
        right
        color="white"
        class="mt-2"
        @click.native.stop="removeFile"
      >
        <v-icon>close</v-icon>
      </v-btn> -->
      <v-img :aspect-ratio="ratio" :src="image || src" alt="" class="img" />
      <!-- </div> -->
      <div v-if="uploading" style="position: absolute">
        <v-progress-circular indeterminate color="primary" />
      </div>
    </v-row>
    <v-btn
      v-if="camera"
      color="primary"
      elevation="0"
      dark
      absolute
      bottom
      right
      fab
      small
      @click="launchCamera"
      style="bottom: -10px; right: -10px"
    >
      <v-icon small>mdi-camera-plus</v-icon>
    </v-btn>
    <v-btn
      v-else
      color="primary"
      elevation="0"
      dark
      absolute
      bottom
      right
      fab
      small
      @click="chooseFiles"
      style="bottom: -10px; right: -10px"
    >
      <v-icon small>mdi-image-plus</v-icon>
    </v-btn>
  </div>
</template>
<script>
import Compressor from "compressorjs";

// import { UPLOAD_IMAGE_REQUEST } from '@/store/actions/image';
export default {
  props: {
    src: {
      type: String,
      default: null,
    },
    ratio: {
      type: Number,
      default: 1,
    },
    label: {
      type: String,
      default: "คลิ๊กหรือลากวางภาพ",
    },
    camera: Boolean,
  },
  data() {
    return {
      name: "",
      image: "",
      uploading: false,
    };
  },
  methods: {
    chooseFiles() {
      this.$refs.fileUpload.click();
    },
    launchCamera() {
      this.$refs.cameraUpload.click();
    },
    onDrop(e) {
      e.stopPropagation();
      e.preventDefault();
      const { files } = e.dataTransfer;
      this.createFile(files[0]);
    },
    onChange(e) {
      const { files } = e.target;
      this.createFile(files[0]);
    },
    createFile(file) {
      if (!file.type.match("image.*")) {
        alert("Select an image");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        //   this.uploadFile(e.target.result);
        this.image = e.target.result;
        // this.$emit("onFileSelected", {
        //   filename: this.name,
        //   base64: this.image,
        // });
      };
      reader.readAsDataURL(file);
      this.name = file.name;
      new Compressor(file, {
        quality: 0.6,
        success: (resultFile) => {
          console.log("resultFile", resultFile);
          this.$emit("onFileSelected", resultFile);
        },
        error: (e) => {
          console.log(e);
          this.$emit("onFileSelected", file);
        },
      });
    },
    clear() {
      this.name = null;
      this.image = null;
    },
    removeFile() {
      this.image = "";
      this.$emit("path", null);
    },
  },
};
</script>

<style scoped>
.preview {
  height: 100%;
  position: relative;
}
input[type="file"] {
  position: absolute;
  opacity: 0;
  z-index: -1;
}
.hidden {
  display: none !important;
}
.hidden.image {
  display: inline-block !important;
}
.display-inline {
  display: inline-block;
  vertical-align: middle;
}
.img {
  height: 100%;
  width: 100%;
  border-radius: 1rem;
}
.drop {
  background-color: #edeceb;
  border-radius: 1rem;
  height: 100%;
  width: 100%;
}
</style>
