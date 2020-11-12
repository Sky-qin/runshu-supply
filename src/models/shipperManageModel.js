import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "shipperManageModel",
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
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination } = yield select((state) => state.shipperManageModel);
      const { current, size } = pagination;
      let params = {
        current,
        size,
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.getShipperList, params);
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
        message.error(data.message || "查询科室失败");
      }
    },
    *insertConsignor({ payload }, { call, put, select }) {
      let params = { ...payload };
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.insertConsignor, params);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });

      if (data && data.success) {
        yield put({ type: "save", payload: { showEditDialog: false } });
        message.success("保存成功！");
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || "保存失败！");
      }
    },
    *updateConsignor({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.shipperManageModel);
      let params = {
        ...payload,
        id: (currentMsg && currentMsg.id) || null,
      };
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.updateConsignor, params);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });

      if (data && data.success) {
        yield put({ type: "save", payload: { showEditDialog: false } });
        message.success("修改成功！");
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || "修改失败！");
      }
    },
    *deleteConsignor({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.shipperManageModel);
      let params = {
        id: currentMsg.id,
      };

      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.deleteConsignor, params);
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
