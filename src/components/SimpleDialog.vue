<template>
  <v-dialog :value="dialog" :max-width="maxWidth" @input="$emit('input', null)">
    <v-card>
      <v-container class="pa-8">
        <v-row v-if="alert" justify="center" class="ma-0 mb-8">
          <img :src="require('@/assets/images/alert.svg')" />
        </v-row>
        <v-row v-if="title" justify="center" class="mb-4">
          <span class="charcoal--text text-h4 text-center">{{ title }}</span>
        </v-row>
        <v-row v-if="message" justify="center" class="mb-4">
          <span class="shadow--text text-h5 text-center">{{ message }}</span>
        </v-row>
        <v-row justify="center">
          <v-col v-if="negativeMessage" cols="12" sm="6">
            <v-btn color="primary" outlined large block @click="negativeClick">
              {{ negativeMessage }}
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6">
            <v-btn color="primary" large block @click="positiveClick">
              {{ positiveMessage }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    alert: Boolean,
    value: null,
    title: null,
    message: null,
    negativeMessage: null,
    positiveMessage: null,
    maxWidth: {
      default: 470,
    },
  },
  watch: {
    value(newVal) {
      this.dialog = newVal !== null;
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    negativeClick() {
      this.dialog = null;
      this.$emit("negative");
    },
    positiveClick() {
      this.dialog = null;
      this.$emit("positive");
    },
  },
};
</script>
<style>
</style>