import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "stockListModel",
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
    searchParams: {
      creator: "",
      hospitalId: null,
      inStockId: null,
      orderNumber: null,
    },
    // addInfo: {},
    // replenishOrderList: [],
    scanCodeProductList: [],
    scanCode: "",
    deliverInfoList: [],
    // new
    basicInfo: {},
    productList: [],
    personList: [],
    personalStockList: [],
    companyStockList: [],
    customerList: [],
    serialnoList: [],
    backStockList: [],
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, searchParams } = yield select(
        (state) => state.stockListModel
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
      const { data } = yield call(API.prepareList, params);
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

    *getAddInfo({ payload }, { call, put, select }) {
      const { id } = payload;
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.preparePreNew, { id });
      yield put({ type: "save", payload: { loading: false } });
      if (data && data.success) {
        const { data: info } = data;
        const { prepareProductList, prepareOrder } = info;
        yield put({
          type: "save",
          payload: {
            basicInfo: prepareOrder,
            productList: prepareProductList,
          },
        });
      } else {
        message.error(data.message || "获取发货信息失败！");
      }
    },

    *getDetail({ payload }, { call, put, select }) {
      const { id } = payload;
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.prepareDetail, { id });
      yield put({ type: "save", payload: { loading: false } });
      if (data && data.success) {
        const { data: info } = data;
        const {
          prepareProductList,
          prepareOrder,
          serialnoList,
          backStockList,
        } = info;

        yield put({
          type: "save",
          payload: {
            basicInfo: prepareOrder,
            productList: prepareProductList,
            serialnoList,
            backStockList,
          },
        });
      } else {
        message.error(data.message || "获取发货信息失败！");
      }
    },

    *addGoods({ payload }, { call, put, select }) {
      const { currentMsg, scanCode } = yield select(
        (state) => state.stockListModel
      );
      const params = {
        prepareId: currentMsg.id,
        serialNo: scanCode,
      };

      yield put({ type: "save", payload: { drawerLoading: true } });
      const { data } = yield call(API.prepareScan, params);
      yield put({ type: "save", payload: { drawerLoading: false } });

      if (data && data.success) {
        message.success("添加成功！");
        payload.audio && payload.audio.play();
        const { scanList, preparePruductList } = data.data;
        yield put({
          type: "save",
          payload: {
            productList: preparePruductList,
            scanCodeProductList: scanList,
            scanCode: "",
          },
        });
      } else {
        message.error(data.message || "添加失败，请重试！");
      }
    },
    *deleteGoods({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.stockListModel);
      const params = {
        prepareId: currentMsg.id,
        serialNo: payload.msg.serialNo,
      };
      yield put({ type: "save", payload: { drawerLoading: true } });
      const { data } = yield call(API.prepareDelete, params);
      yield put({ type: "save", payload: { drawerLoading: false } });

      if (data && data.success) {
        message.success("删除成功！");
        const { scanList, preparePruductList } = data.data;
        yield put({
          type: "save",
          payload: {
            productList: preparePruductList,
            scanCodeProductList: scanList,
          },
        });
      } else {
        message.error(data.message || "删除失败，请重试！");
      }
    },

    *sendOrderSubmit({ payload }, { call, put, select }) {
      const { currentMsg, scanCodeProductList } = yield select(
        (state) => state.stockListModel
      );
      const params = {
        id: currentMsg.id,
        serialNoList: scanCodeProductList,
      };
      yield put({ type: "save", payload: { drawerLoading: true } });
      const { data } = yield call(API.prepareSubmit, params);
      yield put({ type: "save", payload: { drawerLoading: false } });
      if (data && data.success) {
        yield put({ type: "getTableList" });
        yield put({
          type: "save",
          payload: {
            addproductDialog: false,
            basicInfo: {},
            scanCode: "",
            productList: [],
            scanCodeProductList: [],
          },
        });
      } else {
        message.error(data.message || "提交失败，请重试！");
      }
    },

    *getPersonList({ payload }, { call, put, select }) {
      const { data } = yield call(API.findUserList, { type: 2 });
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            personList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "获取创建人枚举失败！");
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
        message.error(data.message || "获取个人仓库枚举失败！");
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
    *customerList({ payload }, { call, put }) {
      const { data } = yield call(API.customerList);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            customerList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "获取公司仓库枚举失败！");
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
