import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "entryModel",
  state: {
    menuList: [],
    activeKey: "home",
  },

  effects: {
    *queryMenu({}, { call, put, select }) {
      const { data } = yield call(API.queryMenu);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            menuList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "删除失败！");
      }
    },
  },

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
