import { message } from "antd";
import API from "../services/api";
import TopOne from "../assets/topOne.png";
import TopTwo from "../assets/topTwo.png";
import TopThree from "../assets/topThree.png";

export default {
  namespace: "homeModel",
  state: {
    data: [],
    loading: false,
    consumeStatistics: {},
    inventoryStatistics: {},
    replenishStatistics: {},
    dateList: [
      { value: "1", label: "周" },
      { value: "2", label: "月" },
      { value: "3", label: "年" },
    ],
    chartsTabList: [
      { value: "1", label: "消耗单" },
      { value: "2", label: "补货单" },
      { value: "3", label: "消耗产品" },
      { value: "4", label: "补货产品" },
    ],
    chartsDateList: [
      { value: "1", label: "日" },
      { value: "2", label: "周" },
      { value: "3", label: "月" },
    ],
    chartsData: [],
    topPic: [TopOne, TopTwo, TopThree],
    date: "1",
    type: "1",
    consumeOrderTopDate: "1",
    hospitalConsumeOrderTopDate: "1",
    replenishOrderTopDate: "1",
    consumeOrderTop: [],
    hospitalConsumeOrderTop: [],
    replenishOrderTop: [],
    totalLoading: false,
    chartsLoading: false,
    topTenLoading: false,
  },

  effects: {
    *getTodayIndex({ payload }, { call, put }) {
      yield put({ type: "save", payload: { totalLoading: true } });
      const { data } = yield call(API.getTodayIndex);
      yield put({ type: "save", payload: { totalLoading: false } });

      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            ...data.data,
          },
        });
      } else {
        message.error(data.message || "查询看板数据失败");
      }
    },
    *getStatistics({ payload }, { call, put, select }) {
      const { date, type } = yield select((state) => state.homeModel);
      yield put({ type: "save", payload: { chartsLoading: true } });
      const { data } = yield call(API.getStatistics, { date, type });
      yield put({ type: "save", payload: { chartsLoading: false } });

      if (data && data.success) {
        yield put({
          type: "save",
          payload: { chartsData: data.data || [] },
        });
      } else {
        message.error(data.message || "查询折线图数据失败！");
      }
    },
    *getIndexTopTen({ payload }, { call, put, select }) {
      const {
        consumeOrderTopDate,
        hospitalConsumeOrderTopDate,
        replenishOrderTopDate,
      } = yield select((state) => state.homeModel);

      yield put({ type: "save", payload: { topTenLoading: true } });
      const { data } = yield call(API.getIndexTopTen, {
        consumeOrderTop: consumeOrderTopDate,
        hospitalConsumeOrderTop: hospitalConsumeOrderTopDate,
        replenishOrderTop: replenishOrderTopDate,
      });
      yield put({ type: "save", payload: { topTenLoading: false } });

      if (data && data.success) {
        const {
          consumeOrderTop = [],
          hospitalConsumeOrderTop = [],
          replenishOrderTop = [],
        } = data.data;
        yield put({
          type: "save",
          payload: {
            consumeOrderTop,
            hospitalConsumeOrderTop,
            replenishOrderTop,
          },
        });
      } else {
        message.error(data.message || "查看top10数据失败！");
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
