export default {
  namespace: "example",
  state: {
    name: "小明",
    age: 20,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      // eslint-disable-line
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
