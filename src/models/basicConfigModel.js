// import { message } from "antd";
// import API from "../services/api";
// import { transferTree } from "../utils/tools";

export default {
  namespace: "basicConfigModel",
  state: {},

  effects: {
    // *queryResource({ payload }, { call, put, select }) {
    //   const { data } = yield call(API.queryResource);
    //   if (data && data.success) {
    //     const resourceList = transferTree(data.data || []);
    //     yield put({
    //       type: "save",
    //       payload: {
    //         resourceList,
    //       },
    //     });
    //   } else {
    //     message.error(data.message || "获取权限列表数据失败");
    //   }
    // },
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
