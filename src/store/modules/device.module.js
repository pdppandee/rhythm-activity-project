import {
  FETCH_DEVICE_LIST,
  ADD_DEVICE,
  UPDATE_DEVICE_STATUS,
  BLINK_DEVICE,
  PING,
  SUBSCRIBE_DEVICE_UPDATE,
  UNSUBSCRIBE_DEVICE_UPDATE,
  SHUFFLE_DEVICE_LIST,
  LOG_REQUEST,
  LOG_ADD_EVENT,
  LOG_RESPONSE,
  SIMULATE_RESPONSE,
  RESET_DEVICE_PING,
} from "@/store/actions.type";
import {
  SET_DEVICE_LIST,
  UPDATE_DEVICE,
  SILENTLY_UPDATE_DEVICE,
  SET_SIMULATE_RESPONSE,
} from "@/store/mutations.type";
import { db } from "@/firebase";
import { PubSub } from "aws-amplify";
import { removeUndefiedField } from "@/utils/helper";

let updateSubscribe = null;

const state = {
  devices: null,
  simulateResponse: false,
};

const getters = {
  devicesPing: (state) => {
    if (state.devices)
      return state.devices.map((device) => {
        const requestTimestamp = parseInt(device.requestTimestamp);
        const responseShakerTimestamp = parseInt(
          device.responseShakerTimestamp
        );
        const responseDetectorTimestamp = parseInt(
          device.responseDetectorTimestamp
        );
        if (!isNaN(requestTimestamp) && !isNaN(responseShakerTimestamp)) {
          device.pingShaker = responseShakerTimestamp - requestTimestamp;
        } else {
          device.pingShaker = undefined;
        }
        if (!isNaN(requestTimestamp) && !isNaN(responseDetectorTimestamp)) {
          device.pingDetector = responseDetectorTimestamp - requestTimestamp;
        } else {
          device.pingDetector = undefined;
        }

        return device;
      });
    else return null;
  },
};

const deviceRef = (state) =>
  db
    .collection("accounts")
    .doc(state.auth.account.id)
    .collection("device");

const actions = {
  async [FETCH_DEVICE_LIST]({ commit, dispatch, rootState, state }) {
    if (state.devices) {
      return state.devices;
    }
    const querySnapshot = await deviceRef(rootState).get();
    const devices = [];
    querySnapshot.forEach((doc) => {
      devices.push(doc.data());
    });
    commit(SET_DEVICE_LIST, devices);
    dispatch(SHUFFLE_DEVICE_LIST);

    return state.devices;
  },
  async [ADD_DEVICE]({ rootState }, device) {
    deviceRef(rootState).add(device);
    return device;
  },
  [UPDATE_DEVICE_STATUS]({ commit }, { id, status }) {
    commit(UPDATE_DEVICE, { id, status });
  },
  [PING]({ commit }, { id }) {
    const timestamp = `${new Date().getTime()}`;

    commit(SILENTLY_UPDATE_DEVICE, { id, requestTimestamp: timestamp });
    try {
      PubSub.publish(`$aws/things/smartangklung/command/${id}`, {
        header: "ping",
        timestamp,
      });
    } catch (e) {
      console.log(e);
    }
    // console.log(`PING ${id}`, {
    //   header: "ping",
    //   timestamp,
    // })
  },
  [RESET_DEVICE_PING]({ state, commit }) {
    if (state.devices) {
      commit(
        SET_DEVICE_LIST,
        state.devices.map((device) =>
          removeUndefiedField({
            ...device,
            requestTimestamp: undefined,
            responseShakerTimestamp: undefined,
            responseDetectorTimestamp: undefined,
          })
        )
      );
    }
  },
  [BLINK_DEVICE]({ state, dispatch }, device) {
    const timestamp = `${new Date().getTime()}`;

    const body = {
      header: "device_active",
      timestamp,
      state: device.state,
    };

    PubSub.publish(`$aws/things/smartangklung/command/${device.id}`, body);
    console.log("request =>", `$aws/things/smartangklung/command/${device.id}`);
    console.log("request =>", body);
    if (device.state === "green") {
      dispatch(LOG_REQUEST, {
        id: device.id,
        requestTimestamp: timestamp,
        songTime: device.songTime,
        events: device.events,
      });

      if (state.simulateResponse) {
        const randomResponseRate = Math.floor(Math.random() * 200); // a greater than 150 result will be missed note.
        if (randomResponseRate < 150) {
          setTimeout(() => {
            dispatch(LOG_RESPONSE, {
              id: device.id,
              requestTimestamp: timestamp,
              songTime: device.songTime,
            });
          }, (randomResponseRate + 100) * 10);
        }
      }
    }
  },
  [SUBSCRIBE_DEVICE_UPDATE]({ commit, state, dispatch }) {
    updateSubscribe = PubSub.subscribe(
      `$aws/things/smartangklung/update`
    ).subscribe({
      next: ({ value }) => {
        switch (value.header) {
          case "is_active": {
            const { id, timestamp, type } = value;
            console.log(SUBSCRIBE_DEVICE_UPDATE, value);
            if (type === "detector") {
              dispatch(LOG_RESPONSE, { id, requestTimestamp: timestamp });
            }
            break;
          }
          case "is_online": {
            const { id, type, bat_level: batLevel, mode } = value;
            dispatch(LOG_ADD_EVENT, { id, type, batLevel, mode });
            break;
          }
          case "ping": {
            console.log(SUBSCRIBE_DEVICE_UPDATE, value);
            const device = state.devices.find((item) => item.id === value.id);
            if (device && device.requestTimestamp === value.timestamp) {
              let updatedDevice = {
                id: value.id,
              };
              if (value.type === "shaker") {
                updatedDevice = {
                  ...updatedDevice,
                  responseShakerTimestamp: `${new Date().getTime()}`,
                };
              }
              if (value.type === "detector") {
                updatedDevice = {
                  ...updatedDevice,
                  responseDetectorTimestamp: `${new Date().getTime()}`,
                };
              }

              commit(UPDATE_DEVICE, updatedDevice);
            }
            break;
          }
          case "device_active": {
            console.log(SUBSCRIBE_DEVICE_UPDATE, value);
            break;
          }
        }
      },
    });
  },
  [UNSUBSCRIBE_DEVICE_UPDATE]() {
    if (updateSubscribe) {
      updateSubscribe.unsubscribe();
    }
  },
  [SHUFFLE_DEVICE_LIST]({ state, commit }) {
    const devices = (state.devices || []).sort(() => 0.5 - Math.random());
    commit(SET_DEVICE_LIST, devices);
  },
  [SIMULATE_RESPONSE]({ commit }, enable) {
    commit(SET_SIMULATE_RESPONSE, enable);
  },
};

const mutations = {
  [SET_DEVICE_LIST]: (state, devices) => {
    state.devices = devices;
  },
  [UPDATE_DEVICE]: (state, device) => {
    const index = state.devices.findIndex((item) => item.id === device.id);
    if (index >= 0) {
      state.devices[index] = { ...state.devices[index], ...device };
      state.devices = [...state.devices];
    }
  },
  [SILENTLY_UPDATE_DEVICE]: (state, device) => {
    const index = state.devices.findIndex((item) => item.id === device.id);
    if (index >= 0) {
      state.devices[index] = { ...state.devices[index], ...device };
    }
  },
  [SET_SIMULATE_RESPONSE]: (state, enable) => {
    state.simulateResponse = enable;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
