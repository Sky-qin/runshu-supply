import { message } from "antd";
import { transferSimpleList } from "../utils/tools";
import API from "../services/api";

export default {
  namespace: "allocateTransferModel",
  state: {
    showDetailDialog: false,
    currentMsg: {},
    data: [],
    loading: false,
    drawerLoading: false,
    pagination: {
      current: 1,
      size: 10,
      total: 0,
    },
    inventoryList: [],
    inventoryPagination: {
      current: 1,
      size: 50,
      total: 0,
    },
    replenishStatusList: [],
    searchParams: {
      orderNumber: null,
      stockId: null,
      userId: null,
    },
    addInfo: {
      typeName: "调拨",
    },
    replenishOrderList: [],
    scanCodeProductList: [],
    scanCode: "",
    // new
    allStockList: [],
    productList: [],
    basicInfo: {},
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, searchParams } = yield select(
        (state) => state.allocateTransferModel
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
      const { data } = yield call(API.findAllocationList, params);
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

    *addGoods({ payload }, { call, put, select }) {
      const { addInfo, scanCode, productList } = yield select(
        (state) => state.allocateTransferModel
      );
      const params = {
        serialNo: scanCode,
        stockId: addInfo.outStockId,
      };
      yield put({ type: "save", payload: { drawerLoading: true } });
      const { data } = yield call(API.allocationScan, params);
      yield put({ type: "save", payload: { drawerLoading: false } });

      if (data && data.success) {
        const { data: addProduct } = data;
        const { serialNo } = addProduct;
        let canAdd = true;
        (productList || []).map((item) => {
          if (item.serialNo === serialNo) {
            canAdd = false;
          }
        });
        productList.push(addProduct);
        if (!canAdd) {
          message.warning("该商品已经在调拨单里,请添加其他商品!");
          yield put({
            type: "save",
            payload: {
              scanCode: "",
            },
          });
          return;
        }
        message.success("添加成功！");
        yield put({
          type: "save",
          payload: {
            scanCode: "",
            productList: [...productList],
          },
        });
      } else {
        message.error(data.message || "添加失败，请重试！");
      }
    },

    *getSendPersonList({ payload }, { call, put }) {
      const { data } = yield call(API.findUserList, { type: 4 });
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            personList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "添加失败，请重试！");
      }
    },
    *getMobileById({ payload }, { call, put, select }) {
      const { data } = yield call(API.getMobileById, {
        id: payload.addInfo.person,
      });
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            addInfo: { ...payload.addInfo, mobile: data.data.consignorPhone },
          },
        });
      } else {
        message.error(data.message || "添加失败，请重试！");
      }
    },
    *sendOrderSubmit({ payload }, { call, put, select }) {
      const { addInfo, productList } = yield select(
        (state) => state.allocateTransferModel
      );
      const params = {
        ...addInfo,
        productList,
      };
      yield put({ type: "save", payload: { drawerLoading: true } });
      const { data } = yield call(API.addAllocationOrder, params);
      yield put({ type: "save", payload: { drawerLoading: false } });
      if (data && data.success) {
        yield put({ type: "getTableList" });
        yield put({
          type: "save",
          payload: {
            addproductDialog: false,
            addInfo: {},
            scanCode: "",
            productList: [],
          },
        });
      } else {
        message.error(data.message || "提交失败，请重试！");
      }
    },

    *getFindAllStock({ payload }, { call, put }) {
      const { keyword } = payload;
      const { data } = yield call(API.findAllStock, { keyword });
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            allStockList: transferSimpleList(data.data || [], "code", "name"),
          },
        });
      } else {
        message.error(data.message || "获取所有仓库枚举失败！");
      }
    },
    *getDetailInfo({ payload }, { call, put }) {
      const { id } = payload;
      const { data } = yield call(API.findAllocationById, { id });
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            basicInfo: data.data || {},
          },
        });
      } else {
        message.error(data.message || "获取所有仓库枚举失败！");
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
