import { message } from "antd";
import { transferCustomTreeList } from "../utils/tools";
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
    categoryList: [],
    dialogCategoryList: [],
    productVendorList: [],
    productNameList: [],
    searchParams: {},
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, searchParams } = yield select(
        (state) => state.picManageModel
      );
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: {
          ...searchParams,
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

    *saveImage({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.picManageModel);
      let params = {
        id: currentMsg.id,
        imageUrl: currentMsg.imageUrl,
        productCategory: currentMsg.productCategory,
        productName: currentMsg.productName,
        productVendor: currentMsg.productVendor,
        isDefault: currentMsg.isDefault,
      };
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.saveImage, params);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });

      if (data && data.success) {
        yield put({ type: "save", payload: { showEditDialog: false } });
        message.success("商品配置图片成功!");
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || "商品配置图片失败!");
      }
    },

    *deleteImage({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.picManageModel);
      let params = {
        id: currentMsg.id,
      };

      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      const { data } = yield call(API.deleteImage, params);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });

      if (data && data.success) {
        yield put({ type: "save", payload: { deleteDialog: false } });
        message.success("删除成功！");
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || "删除失败！");
      }
    },
    *queryCatetoryTree({ payload }, { call, put, select }) {
      const { data } = yield call(API.queryCatetoryTree);
      if (data && data.success) {
        let list = transferCustomTreeList(
          data.data || [],
          "categoryCode",
          "categoryName"
        );
        yield put({
          type: "save",
          payload: {
            categoryList: list,
            dialogCategoryList: list.map((item) => ({
              ...item,
              selectable: false,
            })),
          },
        });
      } else {
        message.error(data.message || "获取产品类别枚举失败！");
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
        yield put({
          type: "save",
          payload: {
            productNameList: data.data || [],
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
