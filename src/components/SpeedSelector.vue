<template>
  <div class="text-center">
    <v-menu top close-on-click>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="btn-options"
          v-bind="attrs"
          v-on="on"
          color="primary"
          outlined
        >
          <v-icon> mdi-fast-forward </v-icon>
          ความเร็วเพลง
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          link
          v-for="(item, index) in items"
          :key="index"
          @click="select(index)"
        >
          <v-list-item-title :class="{['primary--text font-weight-bold']: selectedItem === index}">{{ item.title }}</v-list-item-title>
          <v-list-item-icon v-if="selectedItem === index">
            <v-icon color="primary">mdi-check</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<script>
export default {
  computed: {},
  data() {
    return {
      selectedItem: 1,
      items: [
        { title: "ช้า (0.5X)", value: 0.5 },
        { title: "ปกติ (1X)", value: 1 },
        { title: "เร็ว (2X)", value: 2 },
      ],
    };
  },
  methods: {
    select(index) {
      this.selectedItem = index;
      this.$emit("speed", this.items[index].value);
    },
  },
};
</script>
<style scoped>
.btn-options {
  height: 42px !important;
}
</style>