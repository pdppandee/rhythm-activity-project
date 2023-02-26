import {
  FETCH_PLAYER_LIST,
  GET_PLAYER_BY_ID,
  GET_PROFILE_IMAGE,
  CREATE_PLAYER,
  UPDATE_PLAYER,
  DELETE_PLAYER,
  UPLOAD_PROFILE_IMAGE,
  DELETE_PROFILE_IMAGE,
  ADD_PLAYERS,
} from "@/store/actions.type";
import { SET_PLAYER_LIST } from "@/store/mutations.type";
import { db, storage } from "@/firebase";
import { removeUndefiedField } from "@/utils/helper";
import { v4 } from "uuid";

const state = {
  players: null,
};

const getters = {};

const playerRef = (state) =>
  db
    .collection("accounts")
    .doc(state.auth.account.id)
    .collection("players");

const actions = {
  async [FETCH_PLAYER_LIST]({ commit, dispatch, rootState }, forceUpdate) {
    if (state.players && !forceUpdate) {
      return state.players;
    }
    const querySnapshot = await playerRef(rootState)
      .orderBy("createdAt", "desc")
      .get();


    const players = await Promise.all(
      querySnapshot.docs.filter((doc) => !doc.data().disabled).map(async (doc) => {
        const player = doc.data();
        const imageUrl = await dispatch(GET_PROFILE_IMAGE, {
          path: player.imageUrl,
        }).catch(() => null);
        if (imageUrl) {
          player.imageUrl = imageUrl;
        }
        return player;
      })
    );

    commit(SET_PLAYER_LIST, players);
    return players;
  },
  async [GET_PLAYER_BY_ID]({ dispatch, rootState }, { playerId }) {
    try {
      const querySnapshot = await playerRef(rootState)
        .doc(playerId)
        .get();

      let player = querySnapshot.data();

      if (player) {
        const imageUrl = await dispatch(GET_PROFILE_IMAGE, {
          path: player.imageUrl,
        }).catch(() => null);
        if (imageUrl) {
          player.backupImageUrl = player.imageUrl;
          player.imageUrl = imageUrl;
        }
        return player;
      }
    } catch (_) {
      return null;
    }
  },
  async [GET_PROFILE_IMAGE](_, { path }) {
    return await storage.ref(path).getDownloadURL();
  },
  async [CREATE_PLAYER]({ dispatch }, user) {
    const id = v4();
    user.id = id;
    return await dispatch(UPDATE_PLAYER, { ...user, createdAt: new Date() });
  },
  async [UPDATE_PLAYER]({ rootState }, user) {
    delete user.backupImageUrl;

    return await playerRef(rootState)
      .doc(user.id)
      .set(removeUndefiedField({ ...user, updatedAt: new Date() }));
  },
  async [DELETE_PLAYER]({ rootState }, user) {
    // if (player.backupImageUrl) {
    //   await dispatch(
    //     DELETE_PROFILE_IMAGE,
    //     player.backupImageUrl
    //   ).catch(() => {});
    // }
    return await playerRef(rootState)
      .doc(user.id)
      .update({
        disabled: true,
        updatedAt: new Date(),
      });
  },
  async [UPLOAD_PROFILE_IMAGE](_, file) {
    const ref = storage
      .ref("images/players")
      .child(`${Date.now()}_${file.name}`);
    const snapshot = await ref.put(file);
    return snapshot.ref.fullPath;
  },

  async [DELETE_PROFILE_IMAGE](_, path) {
    return await storage.ref(path).delete();
  },
  async [ADD_PLAYERS]({ rootState }, players) {
    await Promise.all(players.map((player) => playerRef(rootState)
     .doc(player.id)
     .set({
       ...player,
       createdAt: new Date(player.createdAt.seconds * 1000),
       updatedAt: new Date(player.updatedAt.seconds * 1000),
     })))
   },
};

const mutations = {
  [SET_PLAYER_LIST](state, players) {
    state.players = players;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
