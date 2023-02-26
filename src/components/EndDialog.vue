<template>
  <v-dialog :value="dialog" :max-width="maxWidth" @input="$emit('input', null)">
    <v-card>
      <v-container class="pa-10">
        <v-row justify="center">
          <div>
            <v-btn block color="primary" large @click="newGame"
              >เลือกเพลงใหม่</v-btn
            >
            <v-btn block color="primary" class="mt-6" large @click="replay"
              >เล่นซ้ำอีกครั้ง</v-btn
            >
            <v-btn block color="primary" class="mt-6" large @click="menu"
              >กลับสู่หน้าหลัก</v-btn
            >
          </div>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    value: null,
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
      dialog: this.value,
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
    newGame() {
      this.dialog = false;
      this.$emit("newGame");
    },
    replay() {
      this.dialog = false;
      setInterval(() => {
        this.$emit("replay");
      }, 100);
    },
    menu() {
      this.dialog = false;
      this.$emit("menu");
    },
  },
};
</script>
<style>
</style>