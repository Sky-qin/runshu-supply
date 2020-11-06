import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "hospitalManage",
  state: {
    showEditDialog: false,
    switchDialog: false,
    currentMsg: {},
    dialogTitle: "编辑",
    dialogBtnLoading: false,
    adressList: [],
    loading: false,
    storageList: [],
    departmentList: [],
    data: [],
    pagination: {
      current: 1,
      size: 10,
      total: 0,
    },
    condition: null,
    salesmanList: [],
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, condition, userId, isEnable } = yield select(
        (state) => state.hospitalManage
      );
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: {
          condition,
          userId,
          isEnable,
        },
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.queryHospital, params);
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

    *saveHospital({ payload }, { call, put, select }) {
      let params = { ...payload };
      const { currentMsg } = yield select((state) => state.hospitalManage);
      if (currentMsg.id) {
        params = { ...params, pid: currentMsg.id };
      }

      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.saveHospital, params);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });

      if (data && data.success) {
        yield put({ type: "save", payload: { showEditDialog: false } });
        message.success("医院添加成功");
        yield put({
          type: "getTableList",
        });
      } else {
        message.error(data.message || "保存失败！");
      }
    },
    *updateHospital({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.hospitalManage);
      let params = {
        ...payload,
        id: (currentMsg && currentMsg.id) || null,
      };
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.updateHospital, params);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });

      if (data && data.success) {
        yield put({
          type: "save",
          payload: { showEditDialog: false },
        });
        message.success("修改医院成功");
        yield put({
          type: "getTableList",
        });
      } else {
        message.error(data.message || "修改失败！");
      }
    },
    *hospitalUpdateState({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.hospitalManage);
      const { isEnable } = currentMsg;
      let params = {
        id: currentMsg.id,
      };
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.hospitalUpdateState, params);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });
      if (data && data.success) {
        yield put({ type: "save", payload: { switchDialog: false } });
        message.success(`${isEnable ? "停用" : "启用"}成功！`);
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || `${isEnable ? "停用" : "启用"}失败！`);
      }
    },

    *getAddress({ payload }, { call, put }) {
      const { data } = yield call(API.getAddress);
      if (data && data.success) {
        yield put({ type: "save", payload: { adressList: data.data || [] } });
      } else {
        message.error(data.message || "获取城市枚举失败");
      }
    },
    *storageList({ payload }, { call, put }) {
      const { data } = yield call(API.storageList);
      if (data && data.success) {
        yield put({ type: "save", payload: { storageList: data.data || [] } });
      }
    },
    *departmentList({ payload }, { call, put }) {
      const { data } = yield call(API.departmentList);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: { departmentList: data.data || [] },
        });
      }
    },
    *findSalesmanList({ payload }, { call, put }) {
      const { data } = yield call(API.findSalesmanList);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: { salesmanList: data.data || [] },
        });
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
