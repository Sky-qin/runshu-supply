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
    name: "",
    isEnable: null,
    hospitalList: [],
    customerTypeList: [],
    switchDialog: false,
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, name, isEnable } = yield select(
        (state) => state.customerManageModel
      );
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: {
          name,
          isEnable,
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
    *getHospital({ payload }, { call, put }) {
      const { data } = yield call(API.getHospital);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: { hospitalList: data.data || [] },
        });
      } else {
        message.error(data.message || "查询医院枚举失败！");
      }
    },
    *getDePartmentByHsp({ payload }, { call, put }) {
      const { data } = yield call(API.getDePartmentByHsp, payload);
      if (data && data.success) {
        let list = (data.data || []).map((item) => {
          if (item.children && item.children.length === 0) {
            return { ...item };
          }
          return { ...item, disabled: true };
        });
        yield put({
          type: "save",
          payload: { departmentList: list || [] },
        });
      } else {
        message.error(data.message || "查询医院枚举失败！");
      }
    },

    *getCustomerType({ payload }, { call, put }) {
      const { data } = yield call(API.getCustomerType);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: { customerTypeList: data.data || [] },
        });
      } else {
        message.error(data.message || "获取客户类型失败！");
      }
    },
    *addCustomer({ payload }, { call, put }) {
      const { data } = yield call(API.addCustomer, payload);
      if (data && data.success) {
        message.success("新增客户成功！");
        yield put({ type: "getTableList" });
        yield put({ type: "save", payload: { showEditDialog: false } });
      } else {
        message.error(data.message || "新增客户失败！");
      }
    },
    *updateCustomer({ payload }, { call, put }) {
      const { data } = yield call(API.updateCustomer, payload);
      if (data && data.success) {
        message.success("修改成功！");
        yield put({ type: "getTableList" });
        yield put({
          type: "save",
          payload: { showEditDialog: false, switchDialog: false },
        });
      } else {
        message.error(data.message || "修改失败！");
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
