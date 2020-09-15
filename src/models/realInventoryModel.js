import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "realInventoryModel",
  state: {
    showDetailDialog: false,
    currentMsg: {},
    data: [],
    loading: false,
    pagination: {
      current: 1,
      size: 10,
      total: 0,
    },
    productInventoryList: [],
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, stockId } = yield select(
        (state) => state.realInventoryModel
      );
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: {
          stockId,
        },
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.realInventoryList, params);
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
        message.error(data.message || "保存失败！");
      }
    },
    *productStock({ payload }, { call, put, select }) {
      const { data } = yield call(API.productStock, payload);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            showDetailDialog: true,
            productInventoryList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "获取商品库存失败！");
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
