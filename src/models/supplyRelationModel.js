import { message } from "antd";
import API from "../services/api";
import { transferTreeList } from "../utils/tools";

export default {
  namespace: "supplyRelationModel",
  state: {
    showEditDialog: false,
    switchDialog: false,
    currentMsg: {},
    dialogTitle: "编辑",
    dialogBtnLoading: false,
    loading: false,
    supplyList: [],
    customerList: [],
    agencyList: [],
    data: [],
    pagination: {
      current: 1,
      size: 10,
      total: 0,
    },
    keyword: null,
    showDetailDialog: false,
    detailList: [],
    categoryTree: [],
    relationName: "",
    drawerLoading: false,
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, keyword } = yield select(
        (state) => state.supplyRelationModel
      );
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: {
          keyword,
        },
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.supplyRelationList, params);
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

    *supplyRelationSave({ payload }, { call, put, select }) {
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.supplyRelationSave, payload);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });

      if (data && data.success) {
        yield put({
          type: "save",
          payload: { showEditDialog: false },
        });
        message.success("保存成功！");
        yield put({
          type: "getTableList",
        });
      } else {
        message.error(data.message || "保存失败！");
      }
    },

    *supplyRelationSetEnable({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.supplyRelationModel);
      let params = {
        id: currentMsg.id,
        isEnable: !currentMsg.isEnable,
      };
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.supplyRelationSetEnable, params);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });
      if (data && data.success) {
        yield put({ type: "save", payload: { switchDialog: false } });
        message.success("状态修改成功！");
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || "状态修改失败！");
      }
    },

    *supplyRelationDetail({ payload }, { call, put }) {
      const { data } = yield call(API.supplyRelationDetail, payload);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            showEditDialog: true,
            currentMsg: data.data || {},
            dialogTitle: "编辑",
          },
        });
      } else {
        message.error(data.message || "获取详情失败");
      }
    },

    *supplyList({ payload }, { call, put }) {
      const { data } = yield call(API.relationSupplyList);
      if (data && data.success) {
        yield put({ type: "save", payload: { supplyList: data.data || [] } });
      }
    },

    *customerList({ payload }, { call, put }) {
      const { data } = yield call(API.customerList);
      if (data && data.success) {
        yield put({ type: "save", payload: { customerList: data.data || [] } });
      }
    },

    *relationAgencyList({ payload }, { call, put }) {
      const { data } = yield call(API.relationAgencyList);
      if (data && data.success) {
        yield put({ type: "save", payload: { agencyList: data.data || [] } });
      }
    },
    *listCategoryDirectory({ payload }, { call, put }) {
      const { data } = yield call(API.listCategoryDirectory);
      if (data && data.success) {
        let list = transferTreeList(
          (data.data && data.data.categoryList) || []
        );
        let newList = [];

        list.map((item) => {
          return newList.push({ ...item, parentNode: true });
        });

        yield put({
          type: "save",
          payload: { categoryTree: newList || [] },
        });
      } else {
        message.error(data.message || "获取类目失败！");
      }
    },
    *productPriceDetailList({ payload }, { call, put }) {
      yield put({ type: "save", payload: { drawerLoading: true } });
      const { data } = yield call(API.productPriceDetailList, payload);
      yield put({ type: "save", payload: { drawerLoading: false } });

      if (data && data.success) {
        yield put({
          type: "save",
          payload: { detailList: data.data || [] },
        });
      } else {
        message.error(data.message || "获取价格列表失败！");
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
