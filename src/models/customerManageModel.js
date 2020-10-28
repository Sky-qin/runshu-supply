import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "customerManageModel",
  state: {
    data: [],
    loading: false,
    pagination: {
      current: 1,
      size: 10,
      total: 0,
    },
    supplierName: "",
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, supplierName } = yield select(
        (state) => state.customerManageModel
      );
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: {
          supplierName,
        },
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.customerTableList, params);
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
        message.error(data.message || "查询客户列表失败");
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
