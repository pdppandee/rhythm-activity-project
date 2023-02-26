import { FETCH_HISTORY, FETCH_HISTORY_ALL } from "@/store/actions.type";
import { SET_HISTORY, SET_HISTORY_LAST_VISIBLE } from "@/store/mutations.type";
import { db } from "@/firebase";

const state = {
  history: null,
  lastVisible: null,
  historyLimit: 10,
};

const getters = {};

const logRef = (state) =>
  db
    .collection("accounts")
    .doc(state.auth.account.id)
    .collection("logs");

const actions = {
  async [FETCH_HISTORY]({ commit, state, rootState }, fetchFirstPage) {
    let ref = logRef(rootState).orderBy("createdAt", "desc");

    if (state.lastVisible && !fetchFirstPage) {
      ref = ref.startAfter(state.lastVisible);
    }

    const querySnapshot = await ref
      .limit(state.historyLimit)
      .get();

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    const history = querySnapshot.docs.map((doc) => doc.data());

    commit(SET_HISTORY_LAST_VISIBLE, lastVisible);
    commit(SET_HISTORY, { ...state.history, ...history });
    return history;
  },
  async [FETCH_HISTORY_ALL]({ rootState }) {
    let ref = logRef(rootState).orderBy("createdAt", "desc");


    const querySnapshot = await ref
      .get();

    const history = querySnapshot.docs.map((doc) => doc.data());

    return history;
  },
};

const mutations = {
  [SET_HISTORY](state, history) {
    state.history = history;
  },
  [SET_HISTORY_LAST_VISIBLE](state, lastVisible) {
    state.lastVisible = lastVisible;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
