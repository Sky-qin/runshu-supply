import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "inventory",
  state: {
    showEditDialog: false,
    currentMsg: {},
    data: [],
    dialogTitle: "编辑",
    storageList: [],
    loading: false,
    stockId: "",
    pagination: {
      current: 1,
      size: 10,
      total: 0,
    },
  },

  effects: {
    *queryInventoryList({ payload }, { call, put, select }) {
      const { pagination, stockId } = yield select((state) => state.inventory);
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: {
          stockId,
        },
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.queryInventoryList, params);
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
    *storageList({}, { call, put }) {
      const { data } = yield call(API.storageList);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            storageList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "获取库存枚举失败");
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
