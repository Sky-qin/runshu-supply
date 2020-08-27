/* global dd */
/* eslint-disable */
import { message } from "antd";

export default {
  namespace: "loginModel",
  state: {
    name: "loginModel",
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: "save" });
    },
    *login({ payload }, { call, put }) {
      debugger;
      yield put({ type: "ss" });
      dd.ready(() => {
        dd.runtime.permission.requestAuthCode({
          corpId,
          onSuccess(result) {
            const tempCode = result.code && result.code.trim();
            const data = {
              tempCode,
              hirer,
              corpId,
            };
            console.log("data", data);
          },
          onFail(err) {
            console.error("dd.runtime.permission.requestAuthCode", corpId, err);
            let content = err || "服务器开了小差，请稍后重试";
            if (err.errcode || err.errorCode || err.errmsg || err.errorMessage)
              content = `${err.errcode || err.errorCode} - ${
                err.errmsg || err.errorMessage
              }`;
            message.error({
              content,
            });
          },
        });
      });
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
