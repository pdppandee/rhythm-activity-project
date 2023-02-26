import {
  START_PLAYING,
  SELECT_PLAYERS,
  SELECT_SONG,
  SELECT_LEVEL,
  RESET_LOG,
  LOG_REQUEST,
  LOG_RESPONSE,
  LOG_ADD_EVENT,
  SAVE_LOG_RESULT,
  ADD_LOGS,
} from "@/store/actions.type";
import {
  RESET_PLAY,
  SET_PLAYERS,
  SET_SONG,
  SET_LEVEL,
  UPDATE_LOG,
  UPDATE_CACHE_EVENT,
} from "@/store/mutations.type";
import { clone } from "@/utils/helper";
import { db } from "@/firebase";

const state = {
  players: null,
  song: null,
  midiPath: null,
  cacheEvent: {},
  log: {
    device1: [
      {
        requestTimestamp: "1624696023939",
      },
      {
        requestTimestamp: "1624696038098",
      },
      {
        requestTimestamp: "1624696042384",
      },
      {
        requestTimestamp: "1624696046668",
      },
      {
        requestTimestamp: "1624696060953",
      },
      {
        requestTimestamp: "1624696065238",
      },
      {
        requestTimestamp: "1624696075238",
      },
      {
        requestTimestamp: "1624696081668",
      },
      {
        requestTimestamp: "1624696088100",
      },
      {
        requestTimestamp: "1624696092385",
      },
      {
        requestTimestamp: "1624696106666",
      },
      {
        requestTimestamp: "1624696473935",
      },
      {
        requestTimestamp: "1624696488095",
        responseTimestamp: "1624696489150",
      },
      {
        requestTimestamp: "1624696492380",
        responseTimestamp: "1624696493467",
      },
      {
        requestTimestamp: "1624696496665",
      },
      {
        requestTimestamp: "1624696510949",
        responseTimestamp: "1624696511769",
      },
      {
        requestTimestamp: "1624696515234",
        responseTimestamp: "1624696515901",
      },
      {
        requestTimestamp: "1624696525234",
        responseTimestamp: "1624696526119",
      },
      {
        requestTimestamp: "1624696531663",
        responseTimestamp: "1624696532656",
      },
      {
        requestTimestamp: "1624696538094",
      },
      {
        requestTimestamp: "1624696542380",
        responseTimestamp: "1624696543192",
      },
      {
        requestTimestamp: "1624696556664",
        responseTimestamp: "1624696557394",
      },
      {
        requestTimestamp: "1624696560948",
        responseTimestamp: "1624696561820",
      },
      {
        requestTimestamp: "1624696570948",
        responseTimestamp: "1624696571907",
      },
      {
        requestTimestamp: "1624696577377",
        responseTimestamp: "1624696578239",
      },
      {
        requestTimestamp: "1624696583809",
        responseTimestamp: "1624696586041",
      },
      {
        requestTimestamp: "1624696588094",
        responseTimestamp: "1624696589133",
      },
      {
        requestTimestamp: "1624696602378",
        responseTimestamp: "1624696603290",
      },
      {
        requestTimestamp: "1624696606662",
        responseTimestamp: "1624696607555",
      },
    ],
    device8: [
      {
        requestTimestamp: "1624696023943",
      },
      {
        requestTimestamp: "1624696038103",
      },
      {
        requestTimestamp: "1624696042388",
        responseTimestamp: "1624696043479",
      },
      {
        requestTimestamp: "1624696046673",
        responseTimestamp: "1624696047655",
      },
      {
        requestTimestamp: "1624696060957",
        responseTimestamp: "1624696061679",
      },
      {
        requestTimestamp: "1624696065242",
      },
      {
        requestTimestamp: "1624696075253",
      },
      {
        requestTimestamp: "1624696081679",
      },
      {
        requestTimestamp: "1624696088114",
      },
      {
        requestTimestamp: "1624696092389",
      },
      {
        requestTimestamp: "1624696106670",
      },
      {
        requestTimestamp: "1624696473939",
      },
      {
        requestTimestamp: "1624696488099",
      },
      {
        requestTimestamp: "1624696492384",
        responseTimestamp: "1624696493160",
      },
      {
        requestTimestamp: "1624696496669",
      },
      {
        requestTimestamp: "1624696510953",
        responseTimestamp: "1624696511755",
      },
      {
        requestTimestamp: "1624696515238",
        responseTimestamp: "1624696515935",
      },
      {
        requestTimestamp: "1624696525248",
        responseTimestamp: "1624696525926",
      },
      {
        requestTimestamp: "1624696531673",
        responseTimestamp: "1624696532656",
      },
      {
        requestTimestamp: "1624696538108",
        responseTimestamp: "1624696538959",
      },
      {
        requestTimestamp: "1624696542383",
        responseTimestamp: "1624696543109",
      },
      {
        requestTimestamp: "1624696556667",
        responseTimestamp: "1624696557394",
      },
      {
        requestTimestamp: "1624696560953",
        responseTimestamp: "1624696561820",
      },
      {
        requestTimestamp: "1624696570963",
        responseTimestamp: "1624696571907",
      },
      {
        requestTimestamp: "1624696577387",
        responseTimestamp: "1624696578110",
      },
      {
        requestTimestamp: "1624696583822",
        responseTimestamp: "1624696584517",
      },
      {
        requestTimestamp: "1624696588097",
        responseTimestamp: "1624696588990",
      },
      {
        requestTimestamp: "1624696602382",
        responseTimestamp: "1624696603134",
      },
      {
        requestTimestamp: "1624696606667",
        responseTimestamp: "1624696607549",
      },
    ],
    device3: [
      {
        requestTimestamp: "1624696024653",
      },
      {
        requestTimestamp: "1624696030239",
      },
      {
        requestTimestamp: "1624696035954",
      },
      {
        requestTimestamp: "1624696047383",
      },
      {
        requestTimestamp: "1624696053098",
      },
      {
        requestTimestamp: "1624696058813",
      },
      {
        requestTimestamp: "1624696088104",
      },
      {
        requestTimestamp: "1624696093095",
      },
      {
        requestTimestamp: "1624696098812",
      },
      {
        requestTimestamp: "1624696104525",
      },
      {
        requestTimestamp: "1624696474650",
      },
      {
        requestTimestamp: "1624696480234",
      },
      {
        requestTimestamp: "1624696485949",
        responseTimestamp: "1624696486823",
      },
      {
        requestTimestamp: "1624696497375",
        responseTimestamp: "1624696498390",
      },
      {
        requestTimestamp: "1624696503095",
      },
      {
        requestTimestamp: "1624696508809",
        responseTimestamp: "1624696509653",
      },
      {
        requestTimestamp: "1624696538098",
        responseTimestamp: "1624696539165",
      },
      {
        requestTimestamp: "1624696543094",
        responseTimestamp: "1624696543919",
      },
      {
        requestTimestamp: "1624696548809",
        responseTimestamp: "1624696549489",
      },
      {
        requestTimestamp: "1624696554518",
        responseTimestamp: "1624696555216",
      },
      {
        requestTimestamp: "1624696583812",
        responseTimestamp: "1624696584850",
      },
      {
        requestTimestamp: "1624696588809",
        responseTimestamp: "1624696589733",
      },
      {
        requestTimestamp: "1624696594519",
        responseTimestamp: "1624696595558",
      },
      {
        requestTimestamp: "1624696600233",
        responseTimestamp: "1624696601245",
      },
    ],
    device5: [
      {
        requestTimestamp: "1624696025369",
        responseTimestamp: "1624696027497",
      },
      {
        requestTimestamp: "1624696028810",
      },
      {
        requestTimestamp: "1624696033098",
        responseTimestamp: "1624696034100",
      },
      {
        requestTimestamp: "1624696048098",
        responseTimestamp: "1624696048592",
      },
      {
        requestTimestamp: "1624696051668",
        responseTimestamp: "1624696052345",
      },
      {
        requestTimestamp: "1624696055953",
        responseTimestamp: "1624696056994",
      },
      {
        requestTimestamp: "1624696073097",
      },
      {
        requestTimestamp: "1624696086670",
      },
      {
        requestTimestamp: "1624696088109",
      },
      {
        requestTimestamp: "1624696093810",
      },
      {
        requestTimestamp: "1624696097386",
      },
      {
        requestTimestamp: "1624696101701",
      },
      {
        requestTimestamp: "1624696475364",
        responseTimestamp: "1624696476181",
      },
      {
        requestTimestamp: "1624696478805",
      },
      {
        requestTimestamp: "1624696483090",
        responseTimestamp: "1624696483953",
      },
      {
        requestTimestamp: "1624696498095",
        responseTimestamp: "1624696498931",
      },
      {
        requestTimestamp: "1624696501665",
        responseTimestamp: "1624696501925",
      },
      {
        requestTimestamp: "1624696505949",
        responseTimestamp: "1624696506783",
      },
      {
        requestTimestamp: "1624696523093",
        responseTimestamp: "1624696523884",
      },
      {
        requestTimestamp: "1624696536663",
        responseTimestamp: "1624696537465",
      },
      {
        requestTimestamp: "1624696538103",
      },
      {
        requestTimestamp: "1624696543809",
        responseTimestamp: "1624696544369",
      },
      {
        requestTimestamp: "1624696547378",
        responseTimestamp: "1624696547908",
      },
      {
        requestTimestamp: "1624696551693",
        responseTimestamp: "1624696552760",
      },
      {
        requestTimestamp: "1624696568808",
        responseTimestamp: "1624696569564",
      },
      {
        requestTimestamp: "1624696582382",
        responseTimestamp: "1624696583272",
      },
      {
        requestTimestamp: "1624696583817",
      },
      {
        requestTimestamp: "1624696589524",
        responseTimestamp: "1624696590652",
      },
      {
        requestTimestamp: "1624696593094",
      },
      {
        requestTimestamp: "1624696597378",
        responseTimestamp: "1624696598533",
      },
    ],
    device4: [
      {
        requestTimestamp: "1624696027384",
      },
      {
        requestTimestamp: "1624696029529",
      },
      {
        requestTimestamp: "1624696034528",
      },
      {
        requestTimestamp: "1624696038809",
      },
      {
        requestTimestamp: "1624696050239",
      },
      {
        requestTimestamp: "1624696052384",
      },
      {
        requestTimestamp: "1624696057383",
      },
      {
        requestTimestamp: "1624696061669",
        responseTimestamp: "1624696063587",
      },
      {
        requestTimestamp: "1624696068810",
      },
      {
        requestTimestamp: "1624696073818",
      },
      {
        requestTimestamp: "1624696076672",
      },
      {
        requestTimestamp: "1624696082388",
      },
      {
        requestTimestamp: "1624696095955",
      },
      {
        requestTimestamp: "1624696098096",
      },
      {
        requestTimestamp: "1624696103095",
      },
      {
        requestTimestamp: "1624696107381",
      },
      {
        requestTimestamp: "1624696477379",
      },
      {
        requestTimestamp: "1624696479520",
      },
      {
        requestTimestamp: "1624696484519",
        responseTimestamp: "1624696485450",
      },
      {
        requestTimestamp: "1624696488804",
        responseTimestamp: "1624696489625",
      },
      {
        requestTimestamp: "1624696500235",
        responseTimestamp: "1624696501256",
      },
      {
        requestTimestamp: "1624696502381",
      },
      {
        requestTimestamp: "1624696507378",
        responseTimestamp: "1624696508452",
      },
      {
        requestTimestamp: "1624696511664",
        responseTimestamp: "1624696512754",
      },
      {
        requestTimestamp: "1624696518804",
        responseTimestamp: "1624696519650",
      },
      {
        requestTimestamp: "1624696523808",
        responseTimestamp: "1624696525314",
      },
      {
        requestTimestamp: "1624696526668",
      },
      {
        requestTimestamp: "1624696532384",
        responseTimestamp: "1624696535062",
      },
      {
        requestTimestamp: "1624696545949",
      },
      {
        requestTimestamp: "1624696548094",
      },
      {
        requestTimestamp: "1624696553094",
      },
      {
        requestTimestamp: "1624696557378",
        responseTimestamp: "1624696558185",
      },
      {
        requestTimestamp: "1624696564518",
        responseTimestamp: "1624696565395",
      },
      {
        requestTimestamp: "1624696569523",
        responseTimestamp: "1624696570960",
      },
      {
        requestTimestamp: "1624696572383",
        responseTimestamp: "1624696574201",
      },
      {
        requestTimestamp: "1624696578097",
        responseTimestamp: "1624696579793",
      },
      {
        requestTimestamp: "1624696591664",
        responseTimestamp: "1624696592634",
      },
      {
        requestTimestamp: "1624696593809",
      },
      {
        requestTimestamp: "1624696598809",
      },
      {
        requestTimestamp: "1624696603094",
        responseTimestamp: "1624696604218",
      },
    ],
    device6: [
      {
        requestTimestamp: "1624696028099",
      },
      {
        requestTimestamp: "1624696035239",
        responseTimestamp: "1624696035791",
      },
      {
        requestTimestamp: "1624696050953",
        responseTimestamp: "1624696051740",
      },
      {
        requestTimestamp: "1624696058098",
      },
      {
        requestTimestamp: "1624696096671",
      },
      {
        requestTimestamp: "1624696103811",
      },
      {
        requestTimestamp: "1624696478095",
      },
      {
        requestTimestamp: "1624696485235",
        responseTimestamp: "1624696486657",
      },
      {
        requestTimestamp: "1624696500950",
      },
      {
        requestTimestamp: "1624696508095",
        responseTimestamp: "1624696509051",
      },
      {
        requestTimestamp: "1624696546664",
        responseTimestamp: "1624696547415",
      },
      {
        requestTimestamp: "1624696553809",
      },
      {
        requestTimestamp: "1624696592378",
        responseTimestamp: "1624696593203",
      },
      {
        requestTimestamp: "1624696599518",
        responseTimestamp: "1624696600499",
      },
    ],
    device2: [
      {
        requestTimestamp: "1624696030953",
        responseTimestamp: "1624696031813",
      },
      {
        requestTimestamp: "1624696036669",
        responseTimestamp: "1624696037004",
      },
      {
        requestTimestamp: "1624696040954",
      },
      {
        requestTimestamp: "1624696053813",
        responseTimestamp: "1624696054035",
      },
      {
        requestTimestamp: "1624696059528",
      },
      {
        requestTimestamp: "1624696063809",
      },
      {
        requestTimestamp: "1624696069528",
      },
      {
        requestTimestamp: "1624696073812",
      },
      {
        requestTimestamp: "1624696076668",
      },
      {
        requestTimestamp: "1624696082383",
      },
      {
        requestTimestamp: "1624696099526",
      },
      {
        requestTimestamp: "1624696105241",
      },
      {
        requestTimestamp: "1624696480949",
        responseTimestamp: "1624696481705",
      },
      {
        requestTimestamp: "1624696486664",
        responseTimestamp: "1624696487191",
      },
      {
        requestTimestamp: "1624696490949",
      },
      {
        requestTimestamp: "1624696503805",
        responseTimestamp: "1624696504636",
      },
      {
        requestTimestamp: "1624696509519",
        responseTimestamp: "1624696510255",
      },
      {
        requestTimestamp: "1624696513809",
        responseTimestamp: "1624696514581",
      },
      {
        requestTimestamp: "1624696519519",
        responseTimestamp: "1624696520218",
      },
      {
        requestTimestamp: "1624696523804",
        responseTimestamp: "1624696524405",
      },
      {
        requestTimestamp: "1624696526664",
        responseTimestamp: "1624696527708",
      },
      {
        requestTimestamp: "1624696532378",
        responseTimestamp: "1624696533404",
      },
      {
        requestTimestamp: "1624696549518",
        responseTimestamp: "1624696550401",
      },
      {
        requestTimestamp: "1624696555233",
        responseTimestamp: "1624696555900",
      },
      {
        requestTimestamp: "1624696559518",
        responseTimestamp: "1624696560334",
      },
      {
        requestTimestamp: "1624696565233",
        responseTimestamp: "1624696566597",
      },
      {
        requestTimestamp: "1624696569518",
        responseTimestamp: "1624696570680",
      },
      {
        requestTimestamp: "1624696572378",
        responseTimestamp: "1624696573032",
      },
      {
        requestTimestamp: "1624696578093",
        responseTimestamp: "1624696579030",
      },
      {
        requestTimestamp: "1624696582377",
      },
      {
        requestTimestamp: "1624696595238",
        responseTimestamp: "1624696595799",
      },
      {
        requestTimestamp: "1624696600948",
        responseTimestamp: "1624696601338",
      },
      {
        requestTimestamp: "1624696605237",
        responseTimestamp: "1624696605990",
      },
    ],
    device7: [
      {
        requestTimestamp: "1624696041669",
        responseTimestamp: "1624696043181",
      },
      {
        requestTimestamp: "1624696064527",
      },
      {
        requestTimestamp: "1624696086674",
      },
      {
        requestTimestamp: "1624696491665",
        responseTimestamp: "1624696492519",
      },
      {
        requestTimestamp: "1624696514519",
      },
      {
        requestTimestamp: "1624696536668",
        responseTimestamp: "1624696537611",
      },
      {
        requestTimestamp: "1624696560234",
        responseTimestamp: "1624696561217",
      },
      {
        requestTimestamp: "1624696582387",
        responseTimestamp: "1624696583692",
      },
      {
        requestTimestamp: "1624696605948",
      },
    ],
  },
};

const logRef = (state) =>
  db
    .collection("accounts")
    .doc(state.auth.account.id)
    .collection("logs");

const getters = {
  processScores: (state) =>
    Object.keys(state.log).map((deviceId) => {
      const log = state.log[deviceId];
      const allNoteCount = log.length;
      const hitNote = log.filter((record) => record.responseTimestamp);
      const hitNoteCount = hitNote.length;
      const avarageDelay =
        (
          hitNote.map(
            (note) => note.responseTimestamp - note.requestTimestamp
          ) || []
        ).reduce((a, b) => a + b, 0) / hitNoteCount;

      return {
        deviceId,
        allNoteCount,
        hitNoteCount,
        avarageDelay,
        score: (hitNoteCount / allNoteCount) * 100,
      };
    }),
  playerSortedByDeviceCount: (state) =>
    state.players.sort((a, b) => {
      if (a.devices && b.devices) {
        return a.devices.length - b.devices.length;
      }
      return 0;
    }),
};

const actions = {
  [START_PLAYING]: ({ commit }) => {
    commit(RESET_PLAY);
  },
  [SELECT_PLAYERS]: ({ commit }, players) => {
    commit(SET_PLAYERS, players);
  },
  [SELECT_SONG]: ({ commit }, song) => {
    commit(SET_SONG, song);
  },
  [SELECT_LEVEL]: ({ commit }, midiPath) => {
    commit(SET_LEVEL, midiPath);
  },
  [RESET_LOG]: ({ commit }) => {
    commit(UPDATE_LOG, null);
  },
  [LOG_REQUEST]: (
    { commit, state },
    { id, requestTimestamp, songTime, events }
  ) => {
    // console.log("request", `${id}-${requestTimestamp} ${events}`);
    const log = state.log;

    const payload = {
      requestTimestamp,
      songTime,
    };

    if (events) {
      payload.events = events;
      console.log("Found event", payload);
    }

    if (log[id] === undefined) {
      log[id] = [payload];
    } else {
      log[id].push(payload);
    }
    commit(UPDATE_LOG, log);
  },
  [LOG_RESPONSE]: ({ commit, state }, { id, requestTimestamp }) => {
    const responseTimestamp = `${new Date().getTime()}`;
    // console.log("response", `${id}-${requestTimestamp} ${responseTimestamp}`);

    const log = state.log;
    if (log[id]) {
      const record = log[id].filter(
        (record) => record.requestTimestamp === requestTimestamp
      );
      if (record && record.length > 0) {
        record[0].responseTimestamp = responseTimestamp;
      }
    }
    commit(UPDATE_LOG, log);
  },
  [LOG_ADD_EVENT]: ({ commit, state }, { id, batLevel, type, mode }) => {
    const log = state.log;

    const record = {
      timestamp: `${new Date().getTime()}`,
    };
    const deviceId = `${id}_${type}`;
    const deviceInfo = state.cacheEvent[deviceId];

    let newUpdateDeviceInfo = { ...deviceInfo };
    let newEvents = [];

    if (newUpdateDeviceInfo.batLevel !== batLevel) {
      newUpdateDeviceInfo.batLevel = batLevel;
      newEvents.push({
        name: "batLevel",
        value: batLevel,
        type,
      });
    }

    if (newUpdateDeviceInfo.mode !== mode) {
      newUpdateDeviceInfo.mode = mode;
      newEvents.push({
        name: "mode",
        value: mode,
        type,
      });
    }

    if (newEvents.length > 0) {
      record.events = [...(record.events || []), ...newEvents];

      log[id] = [...(log[id] || []), record];

      commit(UPDATE_CACHE_EVENT, {
        ...state.cacheEvent,
        [deviceId]: newUpdateDeviceInfo,
      });

      commit(UPDATE_LOG, log);
    }
  },
  async [SAVE_LOG_RESULT](
    { rootState },
    { logId, songId, stats, players, log, level }
  ) {
    const cloneStats = clone(stats);
    const clonePlayers = clone(players);

    const data = {
      id: logId,
      songId,
      stats: cloneStats,
      players: clonePlayers.map(({ id, devices }) => ({
        id,
        devices: devices ? devices.map((device) => device.id) : null,
      })),
      log,
      level,
      createdAt: new Date(),
    };

    console.log(data);

    await logRef(rootState)
      .doc(logId)
      .set(data);
  },
  async [ADD_LOGS]({ rootState }, logs) {
    await Promise.all(
      logs.map((log) =>
        logRef(rootState)
          .doc(log.id)
          .set({
            ...log,
            createdAt: new Date(log.createdAt.seconds * 1000),
          })
      )
    );
  },
};

const mutations = {
  [RESET_PLAY]: (state) => {
    state.players = null;
    state.song = null;
    state.level = null;
  },
  [SET_PLAYERS]: (state, players) => {
    state.players = players;
  },
  [SET_SONG]: (state, song) => {
    state.song = song;
  },
  [SET_LEVEL]: (state, midiPath) => {
    state.midiPath = midiPath;
  },
  [UPDATE_LOG]: (state, log) => {
    if (log == null) {
      state.log = {};
      state.cacheEvent = {};
    } else {
      state.log = { ...state.log, ...log };
    }
  },
  [UPDATE_CACHE_EVENT]: (state, cache) => {
    state.cacheEvent = cache;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
