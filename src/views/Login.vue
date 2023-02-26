<template>
  <v-container fluid class="fill-height">
    <v-btn class="admin-button" color="primary" text @click="launchAdminSite">ผู้ดูแลระบบ</v-btn>
    <v-row justify="center" align="center">
      <v-col v-if="accounts.length > 0" cols="12" sm8 md="4">
        <v-row justify="center" class="ma-0" style="margin-top: -5rem">
          <v-img
            style="width: 80%; max-width: 280px"
            :src="require('@/assets/logo.svg')"
          />
        </v-row>
        <v-row justify="center" class="mt-12">
          <v-card
            id="login-panel"
            class="elevation-2 mx-4 px-6 py-4"
            style="width: 100%; max-width: 450px"
          >
            <h2 class="text-h4 text-center mb-4">เข้าสู่ระบบ</h2>
            <v-card-text class="pa-0 mb-4">
              <v-select
                :items="accounts"
                item-value="id"
                filled
                v-model="selectedAccount"
                label="เลือกศูนย์"
                item-text="name"
              ></v-select>
              <v-text-field
                v-model="pin"
                placeholder="ใส่รหัส 4 ตัว"
                type="password"
                filled
              />
            </v-card-text>
            <v-card-actions class="pa-0 mb-4">
              <v-row justify="center" class="my-4" v-if="isLoading">
                <v-progress-circular indeterminate color="primary" />
              </v-row>
              <v-btn
                v-else
                @click="login"
                :disabled="!(selectedAccount && pin)"
                large
                block
                color="primary"
                >เข้าสู่ระบบ</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-row>
      </v-col>
      <v-progress-circular v-else color="primary" indeterminate />
    </v-row>
  </v-container>
</template>
<script>
import { FETCH_ACCOUNT_LIST, LOGIN, ERROR } from "@/store/actions.type";

export default {
  data() {
    return {
      isLoading: false,
      selectedAccount: null,
      pin: null,
      accounts: [],
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      const accounts = await this.$store.dispatch(FETCH_ACCOUNT_LIST);
      this.accounts = accounts.sort((a, b) => (a.name < b.name ? -1 : 1));
    },
    async login() {
      if (this.accounts && this.selectedAccount && this.pin) {
        const account = this.accounts.filter(
          (account) => account.id === this.selectedAccount
        );
        if (account[0] && account[0].pin == this.pin) {
          this.isLoading = true;
          await this.$store.dispatch(LOGIN, account[0]);
          this.isLoading = false;
          this.$router.push({ name: "home" });
          return;
        } else {
          this.$store.dispatch(ERROR, "pin ไม่ถูกต้อง");
        }
      }
    },
    launchAdminSite() {
      window.location = "https://admin-smart-angklung.web.app/";
    },
    success() {},
  },
};
</script>
<style lang="scss">
.admin-button {
  position: absolute;
  top: 0;
  right: 0;
  margin: .5rem;
}
</style>