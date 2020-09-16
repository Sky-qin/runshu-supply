import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "replenishmentModel",
  state: {
    showDetailDialog: false,
    currentMsg: {},
    data: [],
    dialogTitle: "编辑",
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
    departmentList: [],
    orderStatusList: [],
    searchParams: {},
  },

  effects: {
    *queryInventoryList({ payload }, { call, put, select }) {
      const { pagination, stockId } = yield select(
        (state) => state.replenishmentModel
      );
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: {
          stockId,
        },
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.queryInventoryList, params);
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
    // *storageList({ payload }, { call, put }) {
    //   const { data } = yield call(API.storageList);
    //   if (data && data.success) {
    //     yield put({
    //       type: "save",
    //       payload: {
    //         storageList: data.data || [],
    //       },
    //     });
    //   } else {
    //     message.error(data.message || "获取库存枚举失败");
    //   }
    // },
    *queryInventoryProduct({ payload }, { call, put, select }) {
      const { currentMsg, inventoryPagination } = yield select(
        (state) => state.replenishmentModel
      );
      const params = {
        current: inventoryPagination.current,
        size: inventoryPagination.size,
        params: {
          productCode: currentMsg.productCode,
          stockId: currentMsg.stockId,
        },
      };
      const { data } = yield call(API.queryInventoryProduct, params);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            showDetailDialog: true,
            inventoryPagination: {
              ...inventoryPagination,
              total: (data.data && data.data.total) || 0,
            },
            inventoryList: (data.data && data.data.records) || [],
          },
        });
      } else {
        message.error(data.message || "获取库存枚举失败");
      }
    },
    *getHospital({ payload }, { call, put, select }) {
      const { data } = yield call(API.getHospital);
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
    *getDePartmentByHsp({ payload }, { call, put, select }) {
      const { data } = yield call(API.getDePartmentByHsp, payload);
      if (data && data.success) {
        let departmentList = (data.data || []).map((item) => {
          const { children } = item;
          if (children && children.length > 0) {
            return { ...item, selectable: false };
          }
          return item;
        });
        yield put({
          type: "save",
          payload: {
            departmentList,
          },
        });
      } else {
        message.error(data.message || "获取医院下科室失败");
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
