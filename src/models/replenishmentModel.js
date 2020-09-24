import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "replenishmentModel",
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
    hospitalList: [],
    replenishStatusList: [],
    searchParams: {
      hospitalId: null,
      orderStatus: null,
      replenishNumber: null,
    },
    addInfo: {},
    replenishOrderList: [],
    scanCodeProductList: [],
    scanCode: "",
    deliverInfoList: [],
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, searchParams } = yield select(
        (state) => state.replenishmentModel
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
      const { data } = yield call(API.replenishList, params);
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

    *getHospital({ payload }, { call, put, select }) {
      const { data } = yield call(API.replenishHospitals);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            hospitalList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "获取医院枚举失败！");
      }
    },
    *replenishStatus({ payload }, { call, put, select }) {
      const { data } = yield call(API.replenishStatus, payload);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            replenishStatusList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "获取补货单状态失败");
      }
    },
    *replenishSure({ payload }, { call, put }) {
      const { data } = yield call(API.replenishSure, payload);
      if (data && data.success) {
        message.success("确认成功！");
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || "确认失败，请重试！");
      }
    },
    *replenishRollBack({ payload }, { call, put }) {
      const { data } = yield call(API.replenishRollBack, payload);
      if (data && data.success) {
        message.success("撤销成功！");
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || "撤销失败，请重试！");
      }
    },
    *getAddInfo({ payload }, { call, put, select }) {
      const { id } = payload;
      const params = { replenishOrderId: id };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.getSendBsicInfo, params);
      yield put({ type: "save", payload: { loading: false } });
      if (data && data.success) {
        const { data: info } = data;
        const { replenishOrderList, ...others } = info;
        yield put({
          type: "save",
          payload: {
            addInfo: {
              ...others,
            },
            replenishOrderList,
          },
        });
      } else {
        message.error(data.message || "获取发货信息失败！");
      }
    },
    *addGoods({ payload }, { call, put, select }) {
      const {
        currentMsg,
        replenishOrderList,
        scanCode,
        scanCodeProductList,
      } = yield select((state) => state.replenishmentModel);
      const params = {
        replenishOrderId: currentMsg.id,
        serialNo: scanCode,
        replenishOrderList,
      };

      yield put({ type: "save", payload: { drawerLoading: true } });
      const { data } = yield call(API.addGoods, params);
      yield put({ type: "save", payload: { drawerLoading: false } });

      if (data && data.success) {
        message.success("添加成功！");
        const { replenishOrderList, scanCodeProduct } = data.data;
        let list = [...scanCodeProductList];
        list.push(scanCodeProduct);
        yield put({
          type: "save",
          payload: {
            replenishOrderList,
            scanCodeProductList: list || [],
            scanCode: "",
          },
        });
      } else {
        message.error(data.message || "添加失败，请重试！");
      }
    },
    *deleteGoods({ payload }, { call, put, select }) {
      const {
        currentMsg,
        replenishOrderList,
        scanCodeProductList,
      } = yield select((state) => state.replenishmentModel);
      const params = {
        replenishOrderId: currentMsg.id,
        serialNo: payload.msg.serialNo,
        replenishOrderList,
      };
      yield put({ type: "save", payload: { drawerLoading: true } });
      const { data } = yield call(API.deleteGoods, params);
      yield put({ type: "save", payload: { drawerLoading: false } });

      if (data && data.success) {
        message.success("删除成功！");
        const { replenishOrderList } = data.data;
        let list = [...scanCodeProductList];
        list.splice(payload.index, 1);
        yield put({
          type: "save",
          payload: {
            replenishOrderList,
            scanCodeProductList: list,
          },
        });
      } else {
        message.error(data.message || "删除失败，请重试！");
      }
    },

    *getSendPersonList({ payload }, { call, put, select }) {
      const { data } = yield call(API.getSendPersonList);
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
      const {
        addInfo,
        replenishOrderList,
        scanCodeProductList,
        currentMsg,
      } = yield select((state) => state.replenishmentModel);
      const serialNoList = (scanCodeProductList || []).map(
        (item) => item.serialNo
      );
      const params = {
        ...addInfo,
        replenishOrderId: currentMsg.id,
        replenishOrderList,
        serialNoList,
      };
      yield put({ type: "save", payload: { drawerLoading: true } });
      const { data } = yield call(API.sendOrderSubmit, params);
      yield put({ type: "save", payload: { drawerLoading: false } });
      if (data && data.success) {
        yield put({ type: "getTableList" });
        yield put({
          type: "save",
          payload: {
            addDialog: false,
            addproductDialog: false,
            addInfo: {},
            scanCode: "",
            replenishOrderList: [],
            scanCodeProductList: [],
          },
        });
      } else {
        message.error(data.message || "提交失败，请重试！");
      }
    },
    *getSendOrderInfo({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.replenishmentModel);
      const params = {
        replenishOrderId: currentMsg.id,
      };
      const { data } = yield call(API.getSendOrderInfo, params);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            deliverInfoList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "获取发货信息失败！");
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
