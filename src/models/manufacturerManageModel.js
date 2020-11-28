import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "manufacturerManageModel",
  state: {
    data: [],
    loading: false,
    pagination: {
      current: 1,
      size: 10,
      total: 0,
    },
    adressList: [],
    keyword: "",
    dialogBtnLoading: false,
    showEditDialog: false,
    unkey: 1,
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, keyword } = yield select(
        (state) => state.manufacturerManageModel
      );
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: {
          keyword,
        },
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.getVendorManageList, params);
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
    *supplyVendorSave({ payload }, { call, put, select }) {
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.supplyVendorSave, payload);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });

      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            showEditDialog: false,
          },
        });
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || "查询库位失败");
      }
    },
    *dicCity({ payload }, { call, put }) {
      const { data } = yield call(API.dicCity, payload);

      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            adressList: data.data || [],
          },
        });
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || "查询城市枚举失败");
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
