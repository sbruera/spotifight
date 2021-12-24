import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: "",
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
  },
  actions: {
    async retrieveToken({ commit }) {
      const response = await fetch("http://localhost:5000/api/v1/auth/token", {
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
      const json = await response.json();
      const token = json.access_token;
      commit("setToken", token);
    },
  },
  getters: {
    token(state) {
      return state.token;
    },
  },
});
