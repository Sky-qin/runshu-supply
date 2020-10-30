import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "makeInventoryModel",
  state: {
    showDetailDialog: false,
    checkInventoryDialog: false,
    currentMsg: {},
    data: [],
    loading: false,
    btnLoading: false,
    drawerLoading: false,
    pagination: {
      current: 1,
      size: 10,
      total: 0,
    },
    searchParams: {
      checkNo: null,
      creator: null,
      checkStatus: null,
      stockId: null,
    },
    inventoryCheck: {},
    productList: [],
    statisticList: [],
    scanCode: null,
    // new
    storageList: [],
    checkStatusList: [],
    basicInfo: {},
    detailList: [],
    detailProductList: [],
    lockDialog: false,
    unLockDialog: false,
    unlockStockList: [],
    lockNum: 0,
    checkNo: null,
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, searchParams } = yield select(
        (state) => state.makeInventoryModel
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
      const { data } = yield call(API.inventoryCheckList, params);
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
      const { data } = yield call(API.queryStockList);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: { storageList: (data.data && data.data.stockList) || [] },
        });
      }
    },
    *unlockStockList({ payload }, { call, put }) {
      const { data } = yield call(API.queryStockList, { lockType: 0 });
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            unlockStockList: (data.data && data.data.stockList) || [],
          },
        });
      }
    },

    *lockStockList({ payload }, { call, put }) {
      const { data } = yield call(API.queryStockList, { lockType: 1 });
      if (data && data.success) {
        if (payload && payload.type && payload.type === "init") {
          yield put({
            type: "save",
            payload: {
              lockNum: (data.data && data.data.number) || 0,
              lockStockList: (data.data && data.data.stockList) || [],
            },
          });
          return;
        }
        yield put({
          type: "save",
          payload: {
            lockNum: (data.data && data.data.number) || 0,
            lockStockList: (data.data && data.data.stockList) || [],
            unLockDialog: true,
          },
        });
      }
    },

    *checkInventory({ payload }, { call, put }) {
      yield put({ type: "save", payload: { btnLoading: true } });
      const { data } = yield call(API.checkInventory, payload);
      yield put({ type: "save", payload: { btnLoading: false } });
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            checkInventoryDialog: false,
            addOrder: true,
            checkNo: data.data,
          },
        });
      } else {
        message.error(data.message || "库存快照保存失败！");
      }
    },
    *stockLockOrUnlock({ payload }, { call, put }) {
      const { type, callBack, stockId } = payload;

      const { data } = yield call(API.stockLockOrUnlock, { stockId });
      if (data && data.success) {
        yield put({ type: "lockStockList", payload: { type: "init" } });
        if (type === "lock") {
          message.success("上锁成功！");
          yield put({ type: "save", payload: { lockDialog: false } });
          return;
        }
        if (type === "unlock") {
          message.success("解锁成功！");
        }
        if (type === "checkInventory") {
          callBack && typeof callBack === "function" && callBack();
        }
      } else {
        message.error(data.message || "库存操作失败！");
      }
    },

    *checkStatusList({ payload }, { call, put }) {
      const { data } = yield call(API.checkStatusList, payload);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            checkStatusList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "获取盘点状态失败！");
      }
    },

    *addGoods({ payload }, { call, put, select }) {
      const { scanCode, checkNo } = yield select(
        (state) => state.makeInventoryModel
      );
      yield put({ type: "save", payload: { drawerLoading: true } });
      const { data } = yield call(API.addCheckGood, {
        inventoryCheckId: checkNo,
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
        message.success("添加成功！");
        payload.audio && payload.audio.play();
        yield put({
          type: "save",
          payload: {
            inventoryCheck: (data.data && data.data.inventoryCheck) || {},
            productList: (data.data && data.data.productList) || [],
            statisticList: (data.data && data.data.statisticList) || [],
          },
        });
      } else {
        message.error(data.message || "添加失败，请重试！");
      }
    },
    *checkCreatorList({ payload }, { call, put, select }) {
      const { data } = yield call(API.checkCreatorList);
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
      const { checkNo } = yield select((state) => state.makeInventoryModel);
      yield put({ type: "save", payload: { drawerLoading: true } });
      const { data } = yield call(API.sendCheckInfo, { id: checkNo });
      yield put({ type: "save", payload: { drawerLoading: false } });
      if (data && data.success) {
        yield put({ type: "getTableList" });
        yield put({ type: "lockStockList", payload: { type: "init" } });
        yield put({
          type: "save",
          payload: {
            inventoryCheck: {},
            productList: [],
            statisticList: [],
            addOrder: false,
          },
        });
      } else {
        message.error(data.message || "提交失败，请重试！");
      }
    },
    *getDetailInfo({ payload }, { call, put }) {
      const { data } = yield call(API.inventoryCheckDetail, { id: payload.id });
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            basicInfo: (data.data && data.data.check) || {},
            detailList: (data.data && data.data.statisticList) || [],
            detailProductList: (data.data && data.data.productList) || [],
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
