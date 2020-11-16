import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "businessProductsModel",
  state: {
    data: [],
    loading: false,
    pagination: {
      current: 1,
      size: 10,
      total: 0,
    },
    keyword: "",
    isOnsale: "",
    pricePermission: false,
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, keyword, isOnsale } = yield select(
        (state) => state.businessProductsModel
      );
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: {
          keyword,
          isOnsale,
        },
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.onSaleProduct, params);
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
        message.error(data.message || "获取产品信息失败！");
      }
    },
    *getPricePermission({ payload }, { call, put, select }) {
      const { data } = yield call(API.getPricePermission);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            pricePermission: data.data,
          },
        });
      } else {
        message.error(data.message || "获取价格权限接口失败！");
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
