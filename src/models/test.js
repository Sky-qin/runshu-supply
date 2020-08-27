import API from "../services/api";

// const { miniGetInfo, miniPostInfo } = api;

export default {
  namespace: "test",
  state: {
    name: "小红",
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
    },
  },

  effects: {
    *queryInfo({ payload }, { call, put }) {
      // eslint-disable-line
      // yield put({ type: "save" });
      // debugger;
      const { data } = yield call(API.miniGetInfo, { name: "222" });
      // const post = yield call(miniPostInfo, { key: "22" });
      console.log("get", data);
      // console.log("post", post);
      const post = yield call(API.miniPostInfo, { key: "sss" });
      console.log("post", post);
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
