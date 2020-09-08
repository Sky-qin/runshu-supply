// import { message } from "antd";
// import { corpId } from "../utils/config";

export default {
  namespace: "loginModel",
  state: {
    name: "loginModel",
  },

  effects: {},

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
    },
  },
};
