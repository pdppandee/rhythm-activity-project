import {
  FETCH_SONG_LIST,
  FETCH_SONG,
  UPLOAD_FILE,
  UPLOAD_SONG_COVER,
  SAVE_SONG,
  DELETE_MUSIC_FILE,
  DELETE_SONG,
  GET_COVER_IMAGE,
  GET_SONG,
} from "@/store/actions.type";
import { SET_SONG_LIST, SONG_FETCHING } from "@/store/mutations.type";
import { db, storage } from "@/firebase";
// eslint-disable-next-line no-unused-vars
import { removeUndefiedField, getCoverFromUrl } from "@/utils/helper";
import { v4 } from "uuid";

export const FileType = {
  MP3: "mp3",
  MIDI_EASY: "midiEasy",
  MIDI_MEDIUM: "midiMedium",
  MIDI_HARD: "midiHard",
};

const state = {
  isSongFetching: false,
  songs: null,
};

const getters = {};

const songRef = () => db.collection("songs");

const actions = {
  async [FETCH_SONG_LIST]({ commit, state, dispatch }, forceUpdate) {
    if (state.songs && !forceUpdate) {
      return state.songs;
    }
    commit(SONG_FETCHING, true);
    const querySnapshot = await songRef()
      .orderBy("updatedAt", "desc")
      .get();

    const songs = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const song = doc.data();
        const imageUrl = await dispatch(GET_COVER_IMAGE, {
          path: song.cover,
        }).catch(() => null);
        if (imageUrl) {
          song.cover = imageUrl;
        }
        return song;
      })
    );

    commit(SET_SONG_LIST, songs);
    commit(SONG_FETCHING, false);

    return songs;
  },
  async [FETCH_SONG]({ dispatch }, { song, midiPath }) {
    if (song && song.midiUrl && song.mp3Url) {
      //already download music file
      return song;
    }

    let midiUrl = null;
    let mp3Url = null;

    if (midiPath) midiUrl = await dispatch(GET_SONG, { path: midiPath });
    if (song.mp3) mp3Url = await dispatch(GET_SONG, { path: song.mp3 });

    return {
      midiUrl,
      mp3Url,
      ...song,
    };
  },
  async [GET_SONG](_, { path }) {
    return storage.ref(path).getDownloadURL();
  },
  async [UPLOAD_FILE](_, { type, file }) {
    if (type === "midi" || type === "mp3") {
      const ref = storage.ref().child(`${type}/${Date.now()}_${file.name}`);
      const snapshot = await ref.put(file);
      return snapshot.ref.fullPath;
    }
    return null;
  },
  async [UPLOAD_SONG_COVER](_, file) {
    const ref = storage.ref("images/cover").child(`${Date.now()}_${file.name}`);
    const snapshot = await ref.put(file);
    return snapshot.ref.fullPath;
  },
  [SAVE_SONG](_, song) {
    if (!song.createdAt) {
      song.createdAt = new Date();
    }
    if (!song.id) {
      song.id = v4();
    }
    return songRef()
      .doc(song.id)
      .set(
        removeUndefiedField({
          ...song,
          updatedAt: new Date(),
        })
      );
  },
  [DELETE_SONG](_, song) {
    return songRef()
      .doc(song.id)
      .delete();
  },
  // async [DELETE_MIDI_FILE](_, {song}) {
  //   await storage
  //     .ref()
  //     .child(song.midi)
  //     .delete();
  //   return db
  //     .collection("songs")
  //     .doc(song.id)
  //     .update({
  //       updatedAt: new Date(),
  //       midi: null,
  //     });
  // },
  async [DELETE_MUSIC_FILE](_, { song, field }) {
    if (
      !Object.keys(FileType)
        .map((key) => FileType[key])
        .includes(field)
    )
      return;
    await storage
      .ref()
      .child(song[field])
      .delete()
      .catch(() => console.error("Fail to delete music file."));
    return db
      .collection("songs")
      .doc(song.id)
      .update({
        updatedAt: new Date(),
        [field]: null,
      });
  },
  async [GET_COVER_IMAGE](_, { path }) {
    return await storage.ref(path).getDownloadURL();
  },
};

const mutations = {
  [SET_SONG_LIST](state, songs) {
    state.songs = songs;
  },
  [SONG_FETCHING](state, status) {
    state.isSongFetching = status;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
