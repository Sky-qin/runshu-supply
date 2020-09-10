import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "wxPersonnelManage",
  state: {
    showEditDialog: false,
    currentMsg: {},
    hospitalList: [],
    data: [],
    loading: false,
    dialogTitle: "编辑",
    pagination: {
      current: 1,
      size: 10,
      total: 0,
    },
  },

  effects: {
    *queryUser({ payload }, { call, put, select }) {
      const { pagination } = yield select((state) => state.wxPersonnelManage);
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: {
          type: "wx",
        },
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.queryUser, params);
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
        message.error(data.message || "查询用户表格数据失败！");
      }
    },
    *getAllHospital({ payload }, { call, put, select }) {
      const { data } = yield call(API.getAllHospital);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            hospitalList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "获取医院枚举失败！");
      }
    },

    *saveUser({ payload }, { call, put, select }) {
      let params = { ...payload };
      const { data } = yield call(API.saveUser, params);
      if (data && data.success) {
        yield put({ type: "save", payload: { showEditDialog: false } });
        message.success("新增用户成功！");
        yield put({ type: "queryUser" });
      } else {
        message.error(data.message || "保存失败！");
      }
    },
    *updateUser({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.wxPersonnelManage);
      let params = {
        ...payload,
        id: (currentMsg && currentMsg.id) || null,
      };
      const { data } = yield call(API.updateUser, params);

      if (data && data.success) {
        yield put({ type: "save", payload: { showEditDialog: false } });
        message.success("修改成功");
        yield put({ type: "queryUser" });
      } else {
        message.error(data.message || "修改失败！");
      }
    },
    *deleteUser({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.wxPersonnelManage);
      let params = {
        ids: (currentMsg && currentMsg.id && [currentMsg.id]) || [],
      };
      const { data } = yield call(API.deleteUser, params);
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
