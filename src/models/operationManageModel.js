import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "operationManageModel",
  state: {
    showEditDialog: false,
    currentMsg: {},
    data: [],
    loading: false,
    dialogTitle: "编辑",
    total: 0,
  },

  effects: {
    *queryUser({ payload }, { call, put, select }) {
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.operationTypeList);
      yield put({ type: "save", payload: { loading: false } });

      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            data: data.data || [],
            total: data.data.length || 0,
          },
        });
      } else {
        message.error(data.message || "查询用户表格数据失败！");
      }
    },

    *operationTypeSave({ payload }, { call, put, select }) {
      let params = { ...payload };
      const { data } = yield call(API.operationTypeSave, params);
      if (data && data.success) {
        yield put({ type: "save", payload: { showEditDialog: false } });
        message.success("新增用户成功！");
        yield put({ type: "queryUser" });
      } else {
        message.error(data.message || "保存失败！");
      }
    },

    *operationTypeDelete({ payload }, { call, put, select }) {
      const { currentMsg } = yield select(
        (state) => state.operationManageModel
      );
      let params = {
        id: currentMsg.id,
      };
      const { data } = yield call(API.operationTypeDelete, params);
      if (data && data.success) {
        yield put({ type: "save", payload: { deleteDialog: false } });
        yield put({ type: "queryUser" });
        message.success("成功删除！");
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
