import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "hospitalManage",
  state: {
    showEditDialog: false,
    deleteDialog: false,
    currentMsg: {},
    dialogTitle: "编辑",
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
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination } = yield select((state) => state.hospitalManage);
      const { current, size } = pagination;
      let params = {
        current,
        size,
      };
      const { data } = yield call(API.queryHospital, params);
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

    // TODO
    *saveHospital({ payload }, { call, put, select }) {
      let params = { ...payload };
      const { currentMsg } = yield select((state) => state.hospitalManage);
      if (currentMsg.id) {
        params = { ...params, pid: currentMsg.id };
      }
      const { data } = yield call(API.saveHospital, params);
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
      const { data } = yield call(API.updateHospital, params);

      if (data && data.success) {
        yield put({ type: "save", payload: { showEditDialog: false } });
        message.success("修改医院成功");
        yield put({
          type: "getTableList",
        });
      } else {
        message.error(data.message || "修改失败！");
      }
    },
    *deleteHospital({}, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.hospitalManage);
      let params = {
        ids: [currentMsg && currentMsg.id] || null,
      };
      const { data } = yield call(API.deleteHospital, params);
      if (data && data.success) {
        yield put({ type: "save", payload: { deleteDialog: false } });
        message.success("成功删除科室");
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || "删除失败！");
      }
    },

    // new
    *getAddress({}, { call, put }) {
      const { data } = yield call(API.getAddress);
      if (data && data.success) {
        yield put({ type: "save", payload: { adressList: data.data || [] } });
      } else {
        message.error(data.message || "获取城市枚举失败");
      }
    },
    *storageList({}, { call, put }) {
      const { data } = yield call(API.storageList);
      if (data && data.success) {
        yield put({ type: "save", payload: { storageList: data.data || [] } });
      }
    },
    *departmentList({}, { call, put }) {
      const { data } = yield call(API.departmentList);
      if (data && data.success) {
        let departmentList = (data.data || []).map((item) => {
          const { children } = item;
          if (children && children.length > 0) {
            return { ...item, selectable: false };
          }
          return item;
        });
        yield put({
          type: "save",
          payload: { departmentList },
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
