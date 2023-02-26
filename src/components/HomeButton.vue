<template>
  <v-btn
    color="primary"
    outlined
    :block="block"
    @click="$router.push({ name: 'home' })"
  >
    <v-icon left> mdi-home </v-icon>
    หน้าหลัก
  </v-btn>
</template>
<script>
export default {
  props: {
    block: Boolean
  }
};
</script>

<style lang="scss" scoped>
</style>