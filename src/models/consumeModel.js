import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "consumeModel",
  state: {
    // 顶部查询项
    searchParams: {
      consumeName: "",
      hospitalId: "",
      departmentId: "",
      orderStatus: "",
      creator: "",
    },
    detailMsg: {},
    showStatusDialog: false,
    showDetailDialog: false,
    currentMsg: {},
    data: [],
    hospitalList: [],
    departmentList: [],
    orderStatusList: [],
    statusList: [],
    applicantList: [],
    dialogTitle: "编辑",
    loading: false,
    pagination: {
      current: 1,
      size: 10,
      total: 0,
    },
  },

  effects: {
    *queryConsumeList({}, { call, put, select }) {
      const { pagination, searchParams } = yield select(
        (state) => state.consumeModel
      );
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: searchParams,
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.queryConsumeList, params);
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
    *getHospital({}, { call, put, select }) {
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
    *getApplicant({}, { call, put, select }) {
      const { data } = yield call(API.getApplicant);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            applicantList: data.data || [],
          },
        });
      }
    },
    *getOrderStatus({}, { call, put, select }) {
      const { data } = yield call(API.getOrderStatus);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            orderStatusList: data.data || [],
          },
        });
      }
    },
    *updateConsumeStatus({}, { call, put, select }) {
      const { currentMsg, clickStatus } = yield select(
        (state) => state.consumeModel
      );
      const params = {
        id: currentMsg.id,
        orderStatus: clickStatus,
        sysVersion: currentMsg.sysVersion,
      };
      const { data } = yield call(API.updateConsumeStatus, params);
      if (data && data.success) {
        message.success("修改成功！");
        yield put({ type: "save", payload: { showStatusDialog: false } });
        yield put({ type: "queryConsumeList" });
      } else {
        message.error(data.message || "修改消耗单状态失败，请重试！");
      }
    },
    *getConsumeDetail({}, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.consumeModel);
      const { data } = yield call(API.getConsumeDetail, {
        id: currentMsg.id,
      });
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            detailMsg: data.data || {},
          },
        });
      } else {
        message.error(data.message || "修改消耗单状态失败，请重试！");
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
