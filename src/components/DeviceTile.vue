<template>
  <v-card
    :class="{ clickable: clickable }"
    v-ripple="clickable"
    @click="$emit('click')"
  >
    <v-card v-if="disabled" class="elevation-0 restrict-device">
      <h1 class="error--text text-center pa-4 text-h5">
        หยุดเล่น {{ title }} ในเพลงนี้
      </h1>
    </v-card>
    <v-container class="pa-4">
      <v-row justify="center">
        <v-img
          :aspect-ratio="188 / 120"
          contain
          :src="require('@/assets/images/angklung-tile.svg')"
        />
      </v-row>
      <v-row class="mt-8" justify="center">
        <span class="text-center charcoal--text">
          <span class="title font-weight-bold">{{ title }}</span>
        </span>
      </v-row>
      <v-row class="pa-2" justify="center">
        <span
          v-if="statusShaker === 1 && statusDetector === 1"
          class="online shadow--text body-1"
          >พร้อมใช้งาน</span
        >
        <span v-else class="offline shadow--text body-1">ไม่พร้อมใช้งาน</span>
        <!-- <span v-if="pingShaker" class="ml-1" style="font-size: 0.5rem">({{ pingShaker }}ms)</span> -->
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
export default {
  props: {
    title: null,
    statusShaker: null,
    pingShaker: null,
    statusDetector: null,
    pingDetector: null,
    disabled: {
      type: Boolean,
      default: false,
    },
    clickable: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style>
.online::before {
  content: "";
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  -moz-border-radius: 0.25rem;
  -webkit-border-radius: 0.25rem;
  border-radius: 0.25rem;
  margin-right: 0.25rem;
  background-color: #91be6e;
}
.offline::before {
  content: "";
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  -moz-border-radius: 0.25rem;
  -webkit-border-radius: 0.25rem;
  border-radius: 0.25rem;
  margin-right: 0.25rem;
  background-color: #de736c;
}
.status-box {
  border-right: 1px solid rgb(189, 189, 189);
}
.restrict-device {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(237, 236, 235, 0.8) !important;
}
</style>