<template>
  <v-card
    :class="{ clickable: clickable }"
    @click="$emit('click')"
    style="position: relative"
  >
    <v-img
      :aspect-ratio="188 / 135"
      :src="src || require('@/assets/images/user-placeholder.svg')"
      :lazy-src="require('@/assets/images/user-placeholder.svg')"
    />
    <v-card-text>
      <v-row justify="center">
        <span class="text-center black--text py-4">
          <span
            class="hidden-md-and-up title font-weight-bold charcoal--text"
            >{{ title }}</span
          >
          <span class="hidden-sm-and-down text-h5 charcoal--text">{{
            title
          }}</span>
        </span>
      </v-row>
    </v-card-text>
    <v-btn
      v-if="showDeleteButton"
      color="error"
      dark
      absolute
      top
      right
      fab
      small
      style="top: -14px; right: -14px"
      @click="$emit('onDelete')"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card v-if="showSelected" class="selected" color="transparent">
      <div>
        <v-row class="check-icon ma-2" justify="center">
          <v-icon dark>mdi-check</v-icon>
        </v-row>
      </div>
    </v-card>
  </v-card>
</template>
<script>
export default {
  props: {
    title: null,
    src: null,
    showSelected: Boolean,
    showDeleteButton: Boolean,
    clickable: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss" scoped>
.selected {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  > div {
    height: 100%;
    border: 4px solid #1c3f52;
    background: #1c3f524a;
  }
  & .check-icon {
    top: 0;
    right: 0;
    position: absolute;
    width: 40px;
    height: 40px;
    background: #1c3f52;
    border-radius: 50%;
  }
}
</style>