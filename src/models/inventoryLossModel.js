import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "inventoryLossModel",
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
      locationCode: null,
      creator: null,
    },
    productList: [],
    scanCode: null,
    storageList: [],
    basicInfo: {},
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, searchParams } = yield select(
        (state) => state.inventoryLossModel
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
      const { data } = yield call(API.inventoryLossList, params);
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
          payload: { storageList: data.data || [] },
        });
      }
    },

    *addGoods({ payload }, { call, put, select }) {
      const { scanCode, stockId, productList } = yield select(
        (state) => state.inventoryLossModel
      );
      yield put({ type: "save", payload: { drawerLoading: true } });
      const { data } = yield call(API.findProductByScanCode, {
        stockId,
        type: 2,
        serialNumber: scanCode,
      });
      yield put({ type: "save", payload: { drawerLoading: false } });
      yield put({
        type: "save",
        payload: {
          scanCode: null,
        },
      });
      if (data && data.success) {
        const { serialNo } = data.data;
        let canAdd = true;
        productList.map((item) => {
          if (item.serialNo === serialNo) {
            canAdd = false;
          }
        });
        if (canAdd) {
          message.success("添加成功！");
          productList.push(data.data);
          yield put({
            type: "save",
            payload: {
              productList: [...productList],
            },
          });
        } else {
          message.warning("商品已经添加！");
        }
      } else {
        message.error(data.message || "添加失败，请重试！");
      }
    },
    *findTabulatorList({ payload }, { call, put, select }) {
      const { data } = yield call(API.findTabulatorList, { type: 2 });
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

    *sendCheckInfo({ payload }, { call, put, select }) {
      const { stockId, remarks, productList } = yield select(
        (state) => state.inventoryLossModel
      );
      if (productList.length === 0) return message.warning("请添加盘盈商品!");
      yield put({ type: "save", payload: { drawerLoading: true } });
      const { data } = yield call(API.addLossOrder, {
        stockId,
        remarks,
        serialNoList: productList,
      });
      yield put({ type: "save", payload: { drawerLoading: false } });
      if (data && data.success) {
        yield put({ type: "getTableList" });
        yield put({
          type: "save",
          payload: {
            stockId: null,
            remarks: "",
            productList: [],
            addOrder: false,
          },
        });
      } else {
        message.error(data.message || "提交失败，请重试！");
      }
    },
    *getDetailInfo({ payload }, { call, put }) {
      const { data } = yield call(API.selectOrderDetail, { id: payload.id });
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
