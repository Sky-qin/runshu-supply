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
    customerList: [],
    showEditDialog: false,
    switchDialog: false,
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, keyword, type, isEnable } = yield select(
        (state) => state.inventoryManageModel
      );
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: {
          keyword,
          type,
          isEnable,
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

    *customerList({ payload }, { call, put }) {
      const { data } = yield call(API.customerList);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            customerList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "客户枚举查询失败！");
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
    *supplyStockSave({ payload }, { call, put }) {
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.supplyStockSave, payload);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });

      if (data && data.success) {
        message.success("保存成功！");
        yield put({
          type: "save",
          payload: {
            showEditDialog: false,
          },
        });
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || "保存失败！");
      }
    },

    *supplyStockSetEnable({ payload }, { call, put, select }) {
      const { currentMsg } = yield select(
        (state) => state.inventoryManageModel
      );
      let params = {
        id: currentMsg.id,
        isEnable: !currentMsg.isEnable,
      };
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.supplyStockSetEnable, params);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });

      if (data && data.success) {
        message.success("状态修改成功！");
        yield put({
          type: "save",
          payload: {
            switchDialog: false,
          },
        });
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || "状态修改失败！");
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
