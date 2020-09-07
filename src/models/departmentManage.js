import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "departmentManage",
  state: {
    showEditDialog: false,
    currentMsg: {},
    data: [],
    dialogTitle: "编辑",
    loading: false,
    pagination: {
      current: 1,
      size: 2,
      total: 1000,
    },
  },

  effects: {
    *queryDepartment({ payload }, { call, put, select }) {
      const { pagination } = yield select((state) => state.departmentManage);
      const { current, size } = pagination;
      let params = {
        current,
        size,
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.queryDepartment, params);
      yield put({ type: "save", payload: { loading: false } });

      if (data && data.success) {
        console.log(data.data);
        yield put({
          type: "save",
          payload: {},
        });
      } else {
        message.error(data.message || "保存失败！");
      }
    },
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
        yield put({ type: "queryDepartment" });
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
        yield put({ type: "queryDepartment" });
      } else {
        message.error(data.message || "修改失败！");
      }
    },
    *deleteDepartment({}, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.departmentManage);
      let params = {
        ids: [currentMsg && currentMsg.id] || null,
      };
      const { data } = yield call(API.deleteDepartment, params);
      if (data && data.success) {
        yield put({ type: "save", payload: { deleteDialog: false } });
        message.success("成功删除科室");
        yield put({ type: "queryDepartment" });
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
