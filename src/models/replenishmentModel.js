import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "replenishmentModel",
  state: {
    showDetailDialog: false,
    addDialog: false,
    currentMsg: {},
    data: [],
    loading: false,
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
