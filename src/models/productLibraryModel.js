import { message } from "antd";
import API from "../services/api";
import { transferList } from "../utils/tools";

export default {
  namespace: "productLibraryModel",
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
    productCategoryList: [],
    productVendorList: [],
    keyword: null,
    productCategory: null,
    productVendor: null,
  },

  effects: {
    *queryProductList({ payload }, { call, put, select }) {
      const {
        pagination,
        keyword,
        productCategory,
        productVendor,
      } = yield select((state) => state.productLibraryModel);
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: {
          keyword,
          productCategory,
          productVendor,
        },
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.queryProductList, params);
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
    *queryProductCategory({ payload }, { call, put, select }) {
      const { data } = yield call(API.queryProductCategory);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            productCategoryList: transferList(
              data.data || [],
              "label",
              "label"
            ),
          },
        });
      } else {
        message.error(data.message || "获取产品类别枚举失败！");
      }
    },
    *productListVendor({ payload }, { call, put }) {
      const { data } = yield call(API.productListVendor);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            productVendorList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "获取生产厂家枚举失败！");
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
