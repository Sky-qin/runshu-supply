import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "inventoryManageModel",
  state: {
    data: [],
    loading: false,
    pagination: {
      current: 1,
      size: 10,
      total: 0,
    },
    keyword: "",
    type: null,
    stockTypeList: [],
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, keyword, type } = yield select(
        (state) => state.inventoryManageModel
      );
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: {
          keyword,
          type,
        },
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.getStockManageList, params);
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
        message.error(data.message || "查询库位失败");
      }
    },
    *getStockTypeList({ payload }, { call, put }) {
      const { data } = yield call(API.stockType);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            stockTypeList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "查询库位类别失败");
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
