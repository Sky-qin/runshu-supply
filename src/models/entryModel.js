import { message } from "antd";
import API from "../services/api";
import { getUrlParam } from "tools-func";

export default {
  namespace: "entryModel",
  state: {
    menuList: [],
    activeKey: getUrlParam("pageType") || "home", // home
  },

  effects: {
    *queryMenu({ payload }, { call, put, select }) {
      const { data } = yield call(API.queryMenu);
      if (data && data.success) {
        let activeKey = "";
        (data.data || []).map((item, index) => {
          const { children } = item;
          if (index === 0) {
            if (children && children.length > 0) {
              activeKey = getUrlParam("pageType") || children[0].value;
            } else {
              activeKey = getUrlParam("pageType") || item.value;
            }
          }
          return null;
        });
        yield put({
          type: "save",
          payload: {
            menuList: data.data || [],
            activeKey,
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
