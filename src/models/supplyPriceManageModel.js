import { message } from "antd";
import API from "../services/api";
import { transferTreeList } from "../utils/tools";

export default {
  namespace: "supplyPriceManageModel",
  state: {
    showAddDialog: false,
    showDetailDialog: false,
    deleteDialog: false,
    currentMsg: {},
    dialogTitle: "编辑",
    dialogBtnLoading: false,
    drawerLoading: false,
    loading: false,
    data: [],
    pagination: {
      current: 1,
      size: 10,
      total: 0,
    },
    keyword: null,
    relationList: [],
    planList: [],
    categoryTree: [],
    detailList: [],
    relationName: "",
    dialogSize: 10,
    dialogCurrent: 1,
    dialogTotal: 0,
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, keyword } = yield select(
        (state) => state.supplyPriceManageModel
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
      const { data } = yield call(API.productPriceList, params);
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

    *initProductPrice({ payload }, { call, put }) {
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.initProductPrice, payload);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });

      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            showAddDialog: false,
            showDetailDialog: true,
            refId: data.data,
          },
        });
        message.success("初始化方案成功！");
        yield put({
          type: "getTableList",
        });
      } else {
        message.error(data.message || "初始化失败！");
      }
    },

    *productPriceDelete({ payload }, { call, put, select }) {
      const { currentMsg } = yield select(
        (state) => state.supplyPriceManageModel
      );
      let params = {
        refId: currentMsg.refId,
      };
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.productPriceDelete, params);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });
      if (data && data.success) {
        yield put({ type: "save", payload: { deleteDialog: false } });
        message.success("删除成功！");
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || "删除失败！");
      }
    },

    *unSetPriceBizRelationList({ payload }, { call, put }) {
      const { data } = yield call(API.unSetPriceBizRelationList);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: { relationList: data.data || [] },
        });
      } else {
        message.error(data.message || "获取关联关系失败！");
      }
    },
    *setPricePlanList({ payload }, { call, put }) {
      const { data } = yield call(API.setPricePlanList);
      const list = (data.data || []).map((item, index) => {
        return {
          value: `${item.value}-${index}`,
          label: item.label,
          unvalue: item.value,
        };
      });
      if (data && data.success) {
        yield put({
          type: "save",
          payload: { planList: list || [] },
        });
      } else {
        message.error(data.message || "获取参考方案失败！");
      }
    },
    *listCategoryDirectory({ payload }, { call, put, select }) {
      const { currentMsg } = yield select(
        (state) => state.supplyPriceManageModel
      );
      const { data } = yield call(API.listCategoryDirectory, {
        planId: currentMsg.planId,
      });
      if (data && data.success) {
        let list = transferTreeList(data.data || []);
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
    *productPriceDetailList({ payload }, { call, put, select }) {
      const { dialogCurrent, dialogSize } = yield select(
        (state) => state.supplyPriceManageModel
      );
      let params = {
        current: dialogCurrent,
        size: dialogSize,
        params: {
          ...payload,
        },
      };
      yield put({ type: "save", payload: { drawerLoading: true } });
      const { data } = yield call(API.productPriceDetailList, params);
      yield put({ type: "save", payload: { drawerLoading: false } });

      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            detailList: (data.data && data.data.records) || [],
            dialogTotal: (data.data && data.data.total) || [],
          },
        });
      } else {
        message.error(data.message || "获取价格列表失败！");
      }
    },
    *productPriceSave({ payload }, { call, put }) {
      const { callBack, ...others } = payload;
      yield put({ type: "save", payload: { drawerLoading: true } });
      const { data } = yield call(API.productPriceSave, others);
      yield put({ type: "save", payload: { drawerLoading: false } });
      callBack && typeof callBack === "function" && callBack();
      if (data && data.success) {
        message.success("修改成功！");
      } else {
        message.error(data.message || "修改失败！");
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
