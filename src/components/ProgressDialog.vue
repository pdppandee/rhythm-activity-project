<template>
  <v-dialog :value="value" @input="$emit('input')" persistent width="300">
    <v-card class="pa-8">
      <v-container>
        <v-row>
          <v-progress-circular class="mr-8" color="primary" indeterminate />
          <span v-if="message" style="align-self: center;">{{ message }}</span>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    message: {
      type: String,
      default: null,
    },
    value: null,
  },
};
</script>
<style>
</style>