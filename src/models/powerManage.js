import { message } from "antd";
import API from "../services/api";
import { transferTree } from "../utils/tools";

export default {
  namespace: "powerManage",
  state: {
    showEditDialog: false,
    deleteDialog: false,
    currentMsg: {},
    dialogTitle: "编辑",
    resourceList: [],
    loading: false,
    dialogBtnLoading: false,
    data: [],
    roleType: "",
    pagination: {
      current: 1,
      size: 10,
      total: 0,
    },
  },

  effects: {
    *saveRole({ payload }, { call, put, select }) {
      let params = { ...payload };
      const { currentMsg } = yield select((state) => state.powerManage);
      if (currentMsg.id) {
        params = { ...params, pid: currentMsg.id };
      }

      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.saveRole, params);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });

      if (data && data.success) {
        yield put({ type: "save", payload: { showEditDialog: false } });
        message.success("新增职位成功");
        yield put({
          type: "queryRole",
        });
      } else {
        message.error(data.message || "保存失败！");
      }
    },
    *updateRole({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.powerManage);
      let params = {
        ...payload,
        id: (currentMsg && currentMsg.id) || null,
      };

      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.updateRole, params);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });

      if (data && data.success) {
        yield put({ type: "save", payload: { showEditDialog: false } });
        message.success("修改职位成功");
        yield put({
          type: "queryRole",
        });
        yield put({
          type: "queryRole",
        });
      } else {
        message.error(data.message || "修改失败！");
      }
    },
    *deleteRole({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.powerManage);
      let params = {
        ids: currentMsg && currentMsg.id && [currentMsg && currentMsg.id],
      };

      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.deleteRole, params);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });

      if (data && data.success) {
        yield put({ type: "save", payload: { deleteDialog: false } });
        message.success("删除成功！");
        yield put({
          type: "queryRole",
        });
      } else {
        message.error(data.message || "删除失败！");
      }
    },

    *changeRoleStatus({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.powerManage);
      let params = {
        id: (currentMsg && currentMsg.id) || "",
        isDeleted: !(currentMsg && currentMsg.isDeleted),
      };
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.changeRoleStatus, params);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });

      if (data && data.success) {
        yield put({ type: "save", payload: { deleteDialog: false } });
        message.success("职位状态修改成功！");
        yield put({
          type: "queryRole",
        });
      } else {
        message.error(data.message || "删除失败！");
      }
    },

    *queryRole({ payload }, { call, put, select }) {
      const { pagination } = yield select((state) => state.powerManage);
      const { current, size } = pagination;
      let params = {
        current,
        size,
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.queryRole, params);
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
        message.error(data.message || "获取权限列表数据失败");
      }
    },
    *queryResource({ payload }, { call, put, select }) {
      const { data } = yield call(API.queryResource);
      if (data && data.success) {
        const resourceList = transferTree(data.data || []);
        yield put({
          type: "save",
          payload: {
            resourceList,
          },
        });
      } else {
        message.error(data.message || "获取权限列表数据失败");
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
