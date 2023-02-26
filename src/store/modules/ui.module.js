import { SHOW_ERROR, HIDE_ERROR, SHOW_TOAST_SUCCESS, HIDE_TOAST_SUCCESS } from '@/store/mutations.type';
import { ERROR, TOAST_SUCCESS } from '@/store/actions.type';

const state = {
  error: null,
  toastSuccess: null,
};

const getters = {
  error: (state) => state.error,
  toastSuccess: (state) => state.toastSuccess,
};

const actions = {
  [ERROR]: ({ commit }, message) => {
    commit(SHOW_ERROR, message);
    setTimeout(() => {
      commit(HIDE_ERROR);
    }, 3000);
  },
  [TOAST_SUCCESS]: ({ commit }, message) => {
    commit(SHOW_TOAST_SUCCESS, message);
    setTimeout(() => {
      commit(HIDE_TOAST_SUCCESS);
    }, 3000);
  },
};

const mutations = {
  [SHOW_ERROR]: (state, message) => {
    state.error = message;
  },
  [HIDE_ERROR]: (state) => {
    state.error = null;
  },
  [SHOW_TOAST_SUCCESS]: (state, message) => {
    state.toastSuccess = message;
  },
  [HIDE_TOAST_SUCCESS]: (state) => {
    state.toastSuccess = null;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};