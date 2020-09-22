import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "inventoryWarnModel",
  state: {
    showEditDialog: false,
    currentMsg: {},
    data: [],
    dialogTitle: "编辑",
    loading: false,
    pagination: {
      current: 1,
      size: 10,
      total: 0,
    },
    dialogBtnLoading: false,
    productList: [],
    type: "1",
    stockList: [],
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, type, keyWord } = yield select(
        (state) => state.inventoryWarnModel
      );
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: {
          keyWord,
          type,
        },
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.findProductBySetWarning, params);
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
    *getUserStock({ payload }, { call, put, select }) {
      const { data } = yield call(API.getUserStock);
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
    *findProductByWarning({ payload }, { call, put, select }) {
      const params = {
        current: 1,
        size: 20,
        params: {
          type: "1",
          ...payload,
        },
      };
      const { data } = yield call(API.findProductByWarning, params);
      if (data && data.success) {
        let list = [];
        list = ((data.data && data.data.records) || []).map((item) => {
          return {
            value: item.productCode,
            label: `${item.productName}-${item.productCode}`,
          };
        });
        yield put({
          type: "save",
          payload: {
            productList: list,
          },
        });
      } else {
        message.error(data.message || "获取产品列表失败");
      }
    },
    *setWarning({ payload }, { call, put, select }) {
      const { type } = yield select((state) => state.inventoryWarnModel);
      let params = { ...payload, type };
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.setWarning, params);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });

      if (data && data.success) {
        yield put({ type: "save", payload: { showEditDialog: false } });
        message.success("新增科室成功");
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || "保存失败！");
      }
    },
    *updateConsignor({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.inventoryWarnModel);
      let params = {
        ...payload,
        id: (currentMsg && currentMsg.id) || null,
      };
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.updateConsignor, params);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });

      if (data && data.success) {
        yield put({ type: "save", payload: { showEditDialog: false } });
        message.success("修改科室成功");
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || "修改失败！");
      }
    },
    *deleteWarning({ payload }, { call, put, select }) {
      const { currentMsg, type } = yield select(
        (state) => state.inventoryWarnModel
      );
      let params = {
        id: currentMsg.id,
        type,
      };

      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.deleteWarning, params);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });

      if (data && data.success) {
        yield put({ type: "save", payload: { deleteDialog: false } });
        message.success("删除成功！");
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || "删除失败！");
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
