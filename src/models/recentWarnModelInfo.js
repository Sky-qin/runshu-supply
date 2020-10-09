import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "recentWarnInfoModel",
  state: {
    data: [],
    loading: false,
    pagination: {
      current: 1,
      size: 10,
      total: 0,
    },
    type: "1",
    stockList: [],
    stockId: "",
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, type, stockId } = yield select(
        (state) => state.recentWarnInfoModel
      );
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: {
          stockId,
          type,
        },
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.findPeriodWarning, params);
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
        message.error(data.message || "查询预警失败");
      }
    },
    *getAllStock({ payload }, { call, put, select }) {
      const { data } = yield call(API.getAllStock, payload);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            stockList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "获取库位信息错误");
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
