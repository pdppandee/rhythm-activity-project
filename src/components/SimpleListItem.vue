<template>
  <v-list-item>
    <v-list-item-avatar v-if="avatarIcon">
      <v-icon>
        {{ avatarIcon }}
      </v-icon>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title v-text="text"></v-list-item-title>
    </v-list-item-content>

    <v-list-item-icon v-if="actionIcon" @click="$emit('click')">
      <v-btn icon>
        <v-icon>
          {{ actionIcon }}
        </v-icon>
      </v-btn>
    </v-list-item-icon>
  </v-list-item>
</template>
<script>
export default {
  props: {
    avatarIcon: null,
    text: null,
    actionIcon: null,
  },
};
</script>
<style lang="">
</style>