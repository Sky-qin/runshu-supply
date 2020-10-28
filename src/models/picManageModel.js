import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "picManageModel",
  state: {
    showEditDialog: false,
    currentMsg: {},
    data: [],
    dialogTitle: "编辑",
    loading: false,
    pagination: {
      current: 1,
      size: 10,
      total: 0,
    },
    dialogBtnLoading: false,
    productList: [],
    type: "2",
    categoryList: [],
    productVendorList: [],
    productNameList: [],
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, type, keyWord } = yield select(
        (state) => state.picManageModel
      );
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: {
          keyWord,
          type,
        },
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.imageList, params);
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
        message.error(data.message || "查询预警失败");
      }
    },

    *setWarning({ payload }, { call, put, select }) {
      const { type } = yield select((state) => state.picManageModel);
      let params = { ...payload, type };
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.setWarning, params);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });

      if (data && data.success) {
        yield put({ type: "save", payload: { showEditDialog: false } });
        message.success("新增科室成功");
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || "保存失败！");
      }
    },
    *updateConsignor({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.picManageModel);
      let params = {
        ...payload,
        id: (currentMsg && currentMsg.id) || null,
      };
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.updateConsignor, params);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });

      if (data && data.success) {
        yield put({ type: "save", payload: { showEditDialog: false } });
        message.success("修改科室成功");
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || "修改失败！");
      }
    },
    *deleteWarning({ payload }, { call, put, select }) {
      const { currentMsg, type } = yield select(
        (state) => state.picManageModel
      );
      let params = {
        id: currentMsg.id,
        type,
      };

      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.deleteWarning, params);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });

      if (data && data.success) {
        yield put({ type: "save", payload: { deleteDialog: false } });
        message.success("删除成功！");
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || "删除失败！");
      }
    },
    *queryProductCategory({ payload }, { call, put }) {
      const { data } = yield call(API.queryProductCategory);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            categoryList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "删除失败！");
      }
    },
    *productVendorListbyCategory({ payload }, { call, put }) {
      const { data } = yield call(API.productVendorListbyCategory, payload);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            productVendorList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "删除失败！");
      }
    },
    *productNameList({ payload }, { call, put }) {
      const { data } = yield call(API.productNameList, payload);
      if (data && data.success) {
        let list = (data.data || []).map((item) => {
          return { value: item.value, label: `${item.value}-${item.label}` };
        });
        yield put({
          type: "save",
          payload: {
            productNameList: list || [],
          },
        });
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
