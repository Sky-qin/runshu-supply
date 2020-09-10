import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "menuModel",
  state: {
    data: [],
    loading: false,
    deleteDialog: false,
    currentMsg: {},
  },

  effects: {
    *getResourceList({ payload }, { call, put, select }) {
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.getResourceList);
      yield put({ type: "save", payload: { loading: false } });
      if (data && data.success) {
        let list = (data.data || []).map((item) => {
          return {
            ...item.resource,
            children:
              item.childrenList && item.childrenList.length === 0
                ? null
                : item.childrenList,
          };
        });
        yield put({
          type: "save",
          payload: {
            data: list,
          },
        });
      } else {
        message.error(data.message || "获取权限列表数据失败");
      }
    },
    *insertResource({ payload }, { call, put, select }) {
      let params = { ...payload };
      const { currentMsg } = yield select((state) => state.menuModel);
      params = { ...params, parentId: currentMsg.parentId };
      const { data } = yield call(API.insertResource, params);
      if (data && data.success) {
        yield put({ type: "save", payload: { showEditDialog: false } });
        message.success("添加成功！");
        yield put({ type: "getResourceList" });
      } else {
        message.error(data.message || "保存失败！");
      }
    },
    *updateResource({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.menuModel);
      let params = {
        ...payload,
        id: (currentMsg && currentMsg.id) || null,
      };
      const { data } = yield call(API.updateResource, params);

      if (data && data.success) {
        yield put({ type: "save", payload: { showEditDialog: false } });
        message.success("修改成功!");
        yield put({ type: "getResourceList" });
      } else {
        message.error(data.message || "修改失败！");
      }
    },
    *deleteResource({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.menuModel);
      let params = {
        id: (currentMsg && currentMsg.id) || null,
      };
      const { data } = yield call(API.deleteResource, params);
      if (data && data.success) {
        yield put({ type: "save", payload: { deleteDialog: false } });
        message.success("成功删除!");
        yield put({ type: "getResourceList" });
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
