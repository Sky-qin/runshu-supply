import { message } from "antd";
import API from "../services/api";
import { transferCustomTreeList } from "../utils/tools";

export default {
  namespace: "realInventoryModel",
  state: {
    showDetailDialog: false,
    currentMsg: {},
    data: [],
    loading: false,
    pagination: {
      current: 1,
      size: 10,
      total: 0,
    },
    productInventoryList: [],
    inventoryNumber: 0,
    prettyInventoryAmount: 0,
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, keyword, validPeriod, category } = yield select(
        (state) => state.realInventoryModel
      );
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: {
          keyword,
          category,
          validPeriod,
        },
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.realInventoryList, params);
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
    *productStock({ payload }, { call, put, select }) {
      const { data } = yield call(API.productStock, payload);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            showDetailDialog: true,
            productInventoryList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "获取商品库存失败！");
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
      const { keyword, category, validPeriod } = yield select(
        (state) => state.realInventoryModel
      );
      let params = {
        keyword,
        category,
        validPeriod,
      };
      const { data } = yield call(API.stockStatistic, params);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            inventoryNumber: (data.data && data.data.inventoryNumber) || 0,
            prettyInventoryAmount:
              (data.data && data.data.prettyInventoryAmount) || 0,
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
