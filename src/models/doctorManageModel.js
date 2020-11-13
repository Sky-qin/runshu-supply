import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "doctorManageModel",
  state: {
    showAddPersonDialog: false,
    showDeleteDialog: false,
    currentMsg: {},
    data: [],
    loading: false,
    dialogBtnLoading: false,
    pushInfoType: 1,
    current: 1,
    size: 10,
    total: 0,
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { current, size, total } = yield select(
        (state) => state.doctorManageModel
      );
      let params = {
        current,
        size,
        total,
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.doctorList, params);
      yield put({ type: "save", payload: { loading: false } });

      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            data: (data.data && data.data.records) || [],
            current: Number((data.data && data.data.current) || 0),
            size: Number((data.data && data.data.size) || 0),
            total: Number((data.data && data.data.total) || 0),
          },
        });
      } else {
        message.error(data.message || "获取列表失败！");
      }
    },

    *addPerson({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.doctorManageModel);
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.doctorSave, {
        ...payload,
        pushMessageId: currentMsg.id,
      });
      yield put({ type: "save", payload: { dialogBtnLoading: false } });
      if (data && data.success) {
        message.success("添加成功！");
        yield put({ type: "save", payload: { showAddPersonDialog: false } });
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || "添加失败！");
      }
    },

    *doctorDelete({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.doctorManageModel);
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.doctorDelete, { id: currentMsg.id });
      yield put({ type: "save", payload: { dialogBtnLoading: false } });
      if (data && data.success) {
        message.success("删除成功！");
        yield put({ type: "save", payload: { showDeleteDialog: false } });
        yield put({ type: "getTableList" });
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
