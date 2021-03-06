import { message } from "antd";
import API from "../services/api";
import { transferCustomTreeList } from "../utils/tools";

export default {
  namespace: "inventory",
  state: {
    showDetailDialog: false,
    currentMsg: {},
    data: [],
    dialogTitle: "编辑",
    storageList: [],
    loading: false,
    stockId: "",
    keyword: "",
    pagination: {
      current: 1,
      size: 10,
      total: 0,
    },
    productCategoryList: [],
    inventoryList: [],
    inventoryPagination: {
      current: 1,
      size: 50,
      total: 0,
    },
    boardInfo: {},
    boardLoading: false,
  },

  effects: {
    *queryInventoryList({ payload }, { call, put, select }) {
      const {
        pagination,
        stockId,
        keyword,
        validPeriod,
        category,
      } = yield select((state) => state.inventory);
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: {
          stockId,
          keyword,
          category,
          validPeriod,
        },
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.queryInventoryList, params);
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
        message.error(data.message || "保存失败！");
      }
    },
    *storageList({ payload }, { call, put }) {
      const { data } = yield call(API.storageList);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            storageList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "获取库存枚举失败");
      }
    },
    *queryInventoryProduct({ payload }, { call, put, select }) {
      const { currentMsg, inventoryPagination, validPeriod } = yield select(
        (state) => state.inventory
      );
      const params = {
        current: inventoryPagination.current,
        size: inventoryPagination.size,
        params: {
          productCode: currentMsg.productCode,
          stockId: currentMsg.stockId,
          validPeriod,
        },
      };
      const { data } = yield call(API.queryInventoryProduct, params);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            showDetailDialog: true,
            inventoryPagination: {
              ...inventoryPagination,
              total: (data.data && data.data.total) || 0,
            },
            inventoryList: (data.data && data.data.records) || [],
          },
        });
      } else {
        message.error(data.message || "获取库存枚举失败");
      }
    },
    *queryCatetoryTree({ payload }, { call, put, select }) {
      const { data } = yield call(API.queryCatetoryTree);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            productCategoryList: transferCustomTreeList(
              data.data || [],
              "categoryCode",
              "categoryName"
            ),
          },
        });
      } else {
        message.error(data.message || "获取产品类别枚举失败");
      }
    },
    *stockStatistic({ payload }, { call, put, select }) {
      const { stockId, keyword, category, validPeriod } = yield select(
        (state) => state.inventory
      );
      let params = {
        stockId,
        keyword,
        category,
        validPeriod,
      };

      yield put({ type: "save", payload: { boardLoading: true } });
      const { data } = yield call(API.stockStatistic, params);
      yield put({ type: "save", payload: { boardLoading: false } });

      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            boardInfo: data.data || {},
          },
        });
      } else {
        message.error(data.message || "获取库存汇总信息失败！");
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
