<template>
  <v-img v-if="src" :aspect-ratio="1 / 1" style="width: 100%;  min-width: 48px;" :src="src" />
  <v-responsive v-else :aspect-ratio="1 / 1">
    <v-row
      style="width: 100%; height: 100%;"
      class="darkBase ma-0"
      justify="center"
      align="center"
    >
      <v-icon large color="smoke">mdi-music-note</v-icon>
    </v-row>
  </v-responsive>
</template>
<script>
export default {
  props: {
    src: {
      type: String,
    },
  },
};
</script>
<style lang="">
</style>