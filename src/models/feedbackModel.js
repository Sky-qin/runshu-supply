import { message } from "antd";
import API from "../services/api";

export default {
  namespace: "feedbackModel",
  state: {
    // 顶部查询项
    searchParams: {
      consumeName: "",
      hospitalId: "",
      departmentId: "",
      orderStatus: "",
      creator: "",
    },
    feedbackDialog: false,
    feedbackInfo: {
      consumeNumber: "",
      remark: "",
      userName: "",
      feedbackTime: "",
      feedbackStatusDesc: "",
      feedUserName: "",
      feedbackStatus: 0,
    },
    detailMsg: {},
    showStatusDialog: false,
    showDetailDialog: false,
    currentMsg: {},
    data: [],
    hospitalList: [],
    departmentList: [],
    orderStatusList: [
      { value: 0, label: "待处理" },
      { value: 1, label: "已处理" },
    ],
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
    *getFeedbackList({ payload }, { call, put, select }) {
      const { pagination, searchParams } = yield select(
        (state) => state.feedbackModel
      );
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: searchParams,
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.getFeedbackList, params);
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
    *getApplicant({ payload }, { call, put, select }) {
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
    *getFeedbackDetail({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.feedbackModel);
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.getFeedbackDetail, { id: currentMsg.id });
      yield put({ type: "save", payload: { loading: false } });
      if (data && data.success) {
        yield put({
          type: "save",
          payload: { feedbackDialog: true, feedbackInfo: data.data || {} },
        });
      } else {
        message.error(data.message || "获取反馈信息异常，请重试！");
      }
    },

    *updateFeedbackStatus({ payload }, { call, put, select }) {
      const { feedbackInfo } = yield select((state) => state.feedbackModel);
      const params = {
        id: feedbackInfo.id,
        sysVersion: feedbackInfo.sysVersion,
        feedbackStatus: payload.status,
      };
      const { data } = yield call(API.updateFeedbackStatus, params);
      if (data && data.success) {
        yield put({ type: "getFeedbackDetail" });
        message.success(data.message || "状态修改成功！");
      } else {
        message.error(data.message || "修改反馈单状态失败");
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
