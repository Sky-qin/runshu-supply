import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "productInfo",
  state: {
    showEditDialog: false,
    currentMsg: {},
    data: [],
    dialogTitle: "编辑",
    loading: false,
    pagination: {
      current: 1,
      size: 10,
      total: 1000,
    },
  },

  effects: {
    *queryProductList({ payload }, { call, put, select }) {
      const { pagination } = yield select((state) => state.productInfo);
      const { current, size } = pagination;
      let params = {
        current,
        size,
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.queryProductList, params);
      yield put({ type: "save", payload: { loading: false } });

      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            pagination: {
              ...pagination,
              total: (data.data && data.data.total) || 0,
            },
            data: (data.data && data.data.records) || [],
          },
        });
      } else {
        message.error(data.message || "获取产品信息失败！");
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
