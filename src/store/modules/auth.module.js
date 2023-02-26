import { CHECK_AUTH, FETCH_ACCOUNT_LIST, LOGIN, LOGOUT, ERROR } from "../actions.type";
import { SET_AUTH, PURGE_AUTH } from "../mutations.type";
// import { auth } from "@/firebase";
import { db } from "@/firebase";
import { Auth } from "aws-amplify";

async function cognitoSignIn(dispatch) {
  let credentials = null;
  try {
    credentials = await Auth.currentAuthenticatedUser();
  } catch (e) {
    credentials = null;
  }


  try {
    if (!credentials) {
      await Auth.signIn(
        "smart-anklung-web",
        "AKIAXDME4DSZK74BH47L"
      );
    }
  } catch (error) {
    dispatch(ERROR, "โปรดตรวจสอบอินเตอร์เน็ตและรีเฟรชหน้าเว็บ [AWS:Auth]")
    console.log("error signing in", error);
  }
}

async function cognitoSignOut() {
  await Auth.signOut();
}

const state = {
  account: {},
  isAuthenticated: false,
};

const getters = {
  account: (state) => state.account,
};

const actions = {
  // eslint-disable-next-line no-unused-vars
  async [FETCH_ACCOUNT_LIST]() {
    const querySnapshot = await db.collection("accounts").get();
    const accounts = [];
    querySnapshot.forEach((doc) => {
      accounts.push(doc.data());
    });
    return accounts;
  },
  async [CHECK_AUTH]({ commit, dispatch, state }) {
    return new Promise((resolve, reject) => {
      if (state.isAuthenticated) {
        cognitoSignIn(dispatch);
        resolve();
      } else {
        const account = localStorage.getItem("account");
        if (account) {
          commit(SET_AUTH, JSON.parse(account));
          cognitoSignIn(dispatch);
          resolve();
        } else {
          reject();
        }
      }
    });
    // return new Promise((resolve, reject) => {
    //   auth.onAuthStateChanged((user) => {
    //     if (user) {
    //       commit(SET_AUTH, user);
    //       resolve();
    //     } else {
    //       commit(PURGE_AUTH);
    //       reject();
    //     }
    //   });
    // });
  },
  async [LOGIN]({ commit, dispatch }, account) {
    // console.log(LOGIN, account);
    await cognitoSignIn(dispatch);
    const { id, name } = account;
    commit(SET_AUTH, { id, name });
  },
  async [LOGOUT]({ commit }) {
    await cognitoSignOut();
    commit(PURGE_AUTH);
  },
};

const mutations = {
  [SET_AUTH](state, account) {
    state.isAuthenticated = true;
    state.account = account;

    localStorage.setItem("account", JSON.stringify(account));
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    state.account = null;

    localStorage.removeItem("account");
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
