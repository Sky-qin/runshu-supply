import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "messagePushModel",
  state: {
    showAddTypeDialog: false,
    showAddPersonDialog: false,
    showDeleteDialog: false,
    currentMsg: {},
    data: [],
    loading: false,
    dialogBtnLoading: false,
    pushInfoTypeList: [],
    pushInfoType: 1,
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pushInfoType } = yield select((state) => state.messagePushModel);
      let params = {
        pushModule: pushInfoType,
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.selectAllPushMessage, params);
      yield put({ type: "save", payload: { loading: false } });

      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            data: data.data || [],
          },
        });
      } else {
        message.error(data.message || "保存失败！");
      }
    },
    *selectPushMessageType({ payload }, { call, put, select }) {
      const { data } = yield call(API.selectPushMessageType);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            pushInfoTypeList: data.data || [],
            pushInfoType: (data.data && data.data[0].pushModule) || null,
          },
        });
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || "获取消息推送类型失败");
      }
    },
    *selectAllSysUser({ payload }, { call, put, select }) {
      const { data } = yield call(API.selectAllSysUser, payload);
      if (data && data.success) {
        let list = (data.data || []).map((item) => {
          return {
            value: item.id,
            label: `${item.userName}${
              item.userPhone ? `（${item.userPhone}）` : ""
            }`,
          };
        });
        yield put({
          type: "save",
          payload: {
            personList: list,
          },
        });
      } else {
        message.error(data.message || "获取用户失败！");
      }
    },
    // *addType({ payload }, { call, put, select }) {
    //   const { pushInfoType } = yield select((state) => state.messagePushModel);
    //   yield put({ type: "save", payload: { dialogBtnLoading: true } });
    // },

    *addPerson({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.messagePushModel);
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.addPushPerson, {
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

    *deletePushUser({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.messagePushModel);
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.deletePushUser, { id: currentMsg.id });
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
