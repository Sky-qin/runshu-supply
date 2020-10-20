import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "hospitalSaleGoodsModel",
  state: {
    // 顶部查询项
    searchParams: {},
    data: [],
    hospitalList: [],
    loading: false,
    pagination: {
      current: 1,
      size: 10,
      total: 0,
    },
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, searchParams } = yield select(
        (state) => state.hospitalSaleGoodsModel
      );
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: searchParams,
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.hospitalOnsaleList, params);
      yield put({ type: "save", payload: { loading: false } });

      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            data: (data.data && data.data.records) || [],
            pagination: {
              ...pagination,
              total: (data.data && data.data.total) || 0,
            },
          },
        });
      } else {
        message.error(data.message || "保存失败！");
      }
    },
    *getHospital({ payload }, { call, put, select }) {
      const { data } = yield call(API.hospitalList);
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
