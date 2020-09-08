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
    // *queryMenu({}, { call, put, select }) {
    //   const { data } = yield call(API.queryMenu, params);
    //   if (data && data.success) {
    //     yield put({
    //       type: "save",
    //       payload: {
    //         menuList: data.data || [],
    //       },
    //     });
    //   } else {
    //     message.error(data.message || "删除失败！");
    //   }
    // },
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
