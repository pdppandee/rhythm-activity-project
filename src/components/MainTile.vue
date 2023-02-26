<template>
  <v-card
    class="clickable fill-height"
    :class="backgroundColor"
    v-ripple
    @click="$emit('click')"
  >
    <v-img v-if="src" :aspect-ratio="1 / 1" :src="src" />
    <v-container v-if="icon" >
      <v-row justify="center">
        <v-responsive :aspect-ratio="1 / 1">
          <div class="fill-height circle-border" :class="backgroundColor">
            <v-icon
              class="fill-height"
              :class="`${color}--text`"
              style="width: 100%"
              size="8rem"
              >{{ icon }}</v-icon
            >
          </div>
        </v-responsive>
      </v-row>
    </v-container>
    <v-card-text class="d-flex align-center">
      <v-container class="pa-0">
        <v-row class="pa-4" justify="center">
          <span
            class="charcoal--text display-1 text-center"
            :class="`${color}--text`"
            >{{ title }}</span
          >
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    title: null,
    icon: null,
    src: null,
    color: null,
    backgroundColor: null,
  },
};
</script>
<style>
</style>