/* global dd */
/* eslint-disable */
import { message } from "antd";
import { corpId } from "../utils/config";
import * as dd from "dingtalk-jsapi";

export default {
  namespace: "loginModel",
  state: {
    name: "loginModel",
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: "save" });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    downAge(state) {
      const { age } = state;
      return { age: age - 1 };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
    },
  },
};
