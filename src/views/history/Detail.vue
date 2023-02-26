<template>
  <div>
    <v-container class="mt-12 px-6">
      <v-row>
        <v-btn color="primary" outlined @click="onBack">
          <v-icon left> mdi-chevron-left </v-icon>
          ย้อนกลับ
        </v-btn>
        <v-spacer />
        <home-button />
      </v-row>
    </v-container>
    <v-container class="mt-12">
      <v-container>
        <v-row justify="space-between" align="center">
          <div class="d-flex">
            <h1 class="text-h4 primary--text">เพลง {{ history.songName }}</h1>
            <v-progress-circular
              v-if="isLoading"
              class="ml-4"
              color="primary"
              indeterminate
            />
          </div>
          <h1 class="text-h4 primary--text">{{ history.bandScore }} คะแนน</h1>
        </v-row>
        <v-row class="mt-4">
          <span class="title shadow--text font-weight-medium">
            {{ displayDate(history.createdAt.toDate()) }}
          </span>
        </v-row>
      </v-container>
      <v-card v-if="history" class="mt-8 elevation-0">
        <v-simple-table class="secondary">
          <template v-slot:default>
            <thead>
              <tr>
                <th
                  class="text-center text-h6 font-weight-bold primary--text"
                  style="min-width: 48px"
                >
                  อันดับ
                </th>
                <th class="text-center py-8" style="min-width: 65px"></th>
                <th
                  class="text-left text-h6 font-weight-bold primary--text"
                  style="min-width: 120px"
                >
                  ชื่อผู้เล่น
                </th>
                <th
                  class="text-center text-h6 font-weight-bold primary--text"
                  style="min-width: 180px"
                >
                  ความถูกต้องในการเล่น
                </th>
                <th
                  class="text-center text-h6 font-weight-bold primary--text"
                  style="min-width: 160px"
                >
                  จังหวะคาดเคลื่อนเฉลี่ย
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in history.players"
                :class="index % 2 === 0 ? 'white' : 'grey lighten-4'"
                :key="index"
              >
                <td class="pa-2 pa-sm-4 mr-2" style="max-width: 56px">
                  <div class="ranking-number mx-auto">
                    <span class="title font-weight-bold primary--text">{{
                      index + 1
                    }}</span>
                  </div>
                </td>
                <td class="pa-2 pa-sm-4 mx-auto" style="max-width: 56px">
                  <v-img
                    :src="
                      item.imageUrl ||
                      require('@/assets/images/user-placeholder.svg')
                    "
                    :lazy-src="require('@/assets/images/user-placeholder.svg')"
                    :aspect-ratio="1"
                    style="width: 48px; max-width: 48px; border-radius: 0.5rem"
                  />
                </td>
                <td class="title charcoal--text font-weight-bold">
                  {{ item.name }}
                </td>
                <td class="title text-center shadow--text font-weight-medium">
                  <span v-if="item.accuaracy"
                    >{{ item.accuaracy.toFixed(0) }} %</span
                  >
                  <span v-else>ไม่พบข้อมูล</span>
                </td>
                <td class="title text-center shadow--text font-weight-medium">
                  <span v-if="item.delay"
                    >{{ (item.delay / 1000).toFixed(2) }} วินาที</span
                  >
                  <span v-else>ไม่พบข้อมูล</span>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
      <v-container v-else>
        <v-row class="mt-8" justify="center">
          <span>กำลังโหลด...</span>
        </v-row>
      </v-container>
    </v-container>
  </div>
</template>
<script>
import scoreMixin from "@/mixins/score";
import HomeButton from "@/components/HomeButton.vue";

export default {
  components: {
    HomeButton,
  },
  mixins: [scoreMixin],
  data() {
    return {
      isLoading: false,
      history: null,
    };
  },
  created() {
    const { history } = this.$route.params;
    if (history) {
      this.history = {
        ...history,
        players: history.players.sort((a, b) => b.accuaracy - a.accuaracy),
      };
    } else {
      this.$router.replace({ name: "history" });
    }
  },
  methods: {
    onBack() {
      this.$router.back();
    },
    displayDate(iso) {
      const date = new Date(iso);
      return `${date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}, ${date.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      })} น.`;
    },
  },
};
</script>
<style lang="scss" scoped>
.title {
  font-weight: 600;
}

table,
th,
tr,
td {
  border-bottom: 0px !important;
}

.ranking-number {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #c6e1ea;
}
</style>