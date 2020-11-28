import { message } from "antd";
import API from "../services/api";
import { transferSimpleList } from "../utils/tools";

export default {
  namespace: "salesmanManageModel",
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
    userList: [],
    customerList: [],
    isEnable: null,
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, keyword, isEnable } = yield select(
        (state) => state.salesmanManageModel
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
      const { data } = yield call(API.customerSalerList, params);
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

    *customerSalerSave({ payload }, { call, put, select }) {
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.customerSalerSave, payload);
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

    *customerSalerSetEnable({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.salesmanManageModel);
      let params = {
        id: currentMsg.id,
        isEnable: !currentMsg.isEnable,
      };
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.customerSalerSetEnable, params);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });
      if (data && data.success) {
        yield put({ type: "save", payload: { switchDialog: false } });
        message.success("状态修改成功！");
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || "状态修改失败！");
      }
    },
    *userSalersNewList({ payload }, { put, call }) {
      const { data } = yield call(API.userSalersNewList);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            userList: transferSimpleList(data.data || [], "userId", "userName"),
          },
        });
      } else {
        message.error(data.message || "获取人员失败！");
      }
    },
    *customerSalerDetail({ payload }, { put, call }) {
      const { data } = yield call(API.customerSalerDetail, payload);
      if (data && data.success) {
        let isManagers = [];
        let isLocals = [];
        ((data.data && data.data.customerList) || []).map((item) => {
          if (item.isLocal) {
            isLocals.push(item.customerId);
          }
          if (item.isManager) {
            isManagers.push(item.customerId);
          }
          return null;
        });
        yield put({
          type: "save",
          payload: {
            currentMsg: { ...(data.data || {}), isLocals, isManagers },
            showEditDialog: true,
            dialogTitle: "编辑",
          },
        });
      } else {
        message.error(data.message || "获取详情失败！");
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
        message.error(data.message || "获取公司仓库枚举失败！");
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
