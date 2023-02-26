<template>
  <v-card>
    <v-card-text class="clickable" v-ripple @click="$emit('onClick')">
      <v-img class="menu-logo" :src="src" :lazy-src="src" contain/>
    </v-card-text>
    <v-card-actions class="pa-0">
      <v-btn
        large
        block
        class="bottom-menu-button"
        :class="color"
        :color="background"
        @click="$emit('onClick')"
        >{{ title }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    src: String,
    title: String,
    background: {
      type: String,
      default: "secondary",
    },
    color: {
      type: String,
      default: "primary--text",
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.menu-logo {
  width: 100%;
  max-height: 150px;
}

.bottom-menu-button {
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  width: 0px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>