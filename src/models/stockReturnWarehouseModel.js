import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "stockReturnWarehouseModel",
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
    searchParams: {
      orderNumber: null,
      outStockId: null,
      creator: null,
    },
    addInfo: {
      typeName: "调拨",
    },
    replenishOrderList: [],
    scanCodeProductList: [],
    scanCode: "",
    // new
    personalStockList: [],
    companyStockList: [],
    productList: [],
    basicInfo: {},
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, searchParams } = yield select(
        (state) => state.stockReturnWarehouseModel
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
      const { data } = yield call(API.backStoreList, params);
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
        (state) => state.stockReturnWarehouseModel
      );
      const params = {
        serialNo: scanCode,
        outStockId: addInfo.outStockId,
      };
      yield put({ type: "save", payload: { drawerLoading: true } });
      const { data } = yield call(API.backStoreScan, params);
      yield put({ type: "save", payload: { drawerLoading: false } });

      if (data && data.success) {
        const { data: addProduct } = data;
        const { serialNo } = addProduct;
        let canAdd = true;
        (productList || []).map((item) => {
          if (item.serialNo === serialNo) {
            canAdd = false;
          }
          return null;
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
        payload.audio && payload.audio.play();

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
      const { data } = yield call(API.findUserList, { type: 3 });
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

    *sendOrderSubmit({ payload }, { call, put, select }) {
      const { addInfo, productList } = yield select(
        (state) => state.stockReturnWarehouseModel
      );
      const params = {
        ...addInfo,
        productList,
      };
      yield put({ type: "save", payload: { drawerLoading: true } });
      const { data } = yield call(API.addBackOrder, params);
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

    *personalStock({ payload }, { call, put }) {
      const { data } = yield call(API.personalStock);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            personalStockList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "获取所有仓库枚举失败！");
      }
    },
    *companyStock({ payload }, { call, put }) {
      const { data } = yield call(API.companyStock);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            companyStockList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "获取公司仓库枚举失败！");
      }
    },
    *getDetailInfo({ payload }, { call, put }) {
      const { id } = payload;
      const { data } = yield call(API.queryBackDetailInfo, { id });
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            basicInfo: data.data || {},
          },
        });
      } else {
        message.error(data.message || "获取详情信息失败！");
      }
    },
    *initAddRepareBack({ payload }, { call, put }) {
      const { data } = yield call(API.initAddRepareBack);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            addproductDialog: true,
            addInfo: {
              orderNumber: (data.data && data.data.orderNumber) || null,
              // inStockId: (data.data && data.data.inStockId) || null,
              // inStock: "<<公司库>>",
              typeName: "备货返库",
            },
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
