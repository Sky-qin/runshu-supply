import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "agentManageModel",
  state: {
    showEditDialog: false,
    switchDialog: false,
    currentMsg: {},
    dialogTitle: "编辑",
    dialogBtnLoading: false,
    loading: false,
    data: [],
    pagination: {
      current: 1,
      size: 10,
      total: 0,
    },
    keyword: null,
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, keyword, isEnable } = yield select(
        (state) => state.agentManageModel
      );
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: {
          keyword,
          isEnable,
        },
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.agencyCompanyList, params);
      yield put({ type: "save", payload: { loading: false } });

      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            data: (data.data && data.data.records) || [],
            pagination: {
              ...pagination,
              total: (data.data && data.data.total) || 0,
            },
          },
        });
      } else {
        message.error(data.message || "获取表格数据失败");
      }
    },

    *agentCompanySave({ payload }, { call, put, select }) {
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.agencyCompanySave, payload);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });

      if (data && data.success) {
        yield put({ type: "save", payload: { showEditDialog: false } });
        message.success("保存成功！");
        yield put({
          type: "getTableList",
        });
      } else {
        message.error(data.message || "保存失败！");
      }
    },

    *agentCompanySetEnable({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.agentManageModel);
      let params = {
        id: currentMsg.id,
        isEnable: !currentMsg.isEnable,
      };
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.agencyCompanySetEnable, params);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });
      if (data && data.success) {
        yield put({ type: "save", payload: { switchDialog: false } });
        message.success("状态修改成功！");
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
