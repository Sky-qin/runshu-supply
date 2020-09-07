import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "powerManage",
  state: {
    showEditDialog: false,
    currentMsg: {},
    dialogTitle: "编辑",
    adressList: [],
    storageList: [],
    departmentList: [],
    loading: false,
    data: [],
    pagination: {
      current: 1,
      size: 10,
      total: 1000,
    },
  },

  effects: {
    // TODO
    *addDepartment({ payload }, { call, put, select }) {
      let params = { ...payload };
      const { currentMsg } = yield select((state) => state.departmentManage);
      if (currentMsg.id) {
        params = { ...params, pid: currentMsg.id };
      }
      const { data } = yield call(API.addDepartment, params);
      if (data && data.success) {
        yield put({ type: "save", payload: { showEditDialog: false } });
        message.success("新增科室成功");
        console.log("TODO: 获取表格信息");
      } else {
        message.error(data.message || "保存失败！");
      }
    },
    *editDepartment({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.departmentManage);
      let params = {
        ...payload,
        id: (currentMsg && currentMsg.id) || null,
      };
      const { data } = yield call(API.editDepartment, params);

      if (data && data.success) {
        yield put({ type: "save", payload: { showEditDialog: false } });
        message.success("修改科室成功");
        console.log("TODO: 获取表格信息");
      } else {
        message.error(data.message || "修改失败！");
      }
    },
    *deleteDepartment({}, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.departmentManage);
      let params = {
        id: (currentMsg && currentMsg.id) || null,
      };
      const { data } = yield call(API.deleteDepartment, params);
      if (data && data.success) {
        yield put({ type: "save", payload: { deleteDialog: false } });
        message.success("成功删除科室");
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
