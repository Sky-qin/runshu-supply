import { message } from "antd";
import moment from "moment";
import API from "../services/api";

export default {
  namespace: "deliveryManageModel",
  state: {
    showDetailDialog: false,
    addproductDialog: false,
    replenishmentDetailDialog: false,
    addInfo: {},
    scanCode: "",
    replenishOrderList: [],
    scanCodeProductList: [],
    drawerLoading: false,
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
    personList: [],
    searchParams: {},
    deliveryStatusList: [],
    productList: [],
    basicInfo: {},
    replenishmentList: [],
    replenishTodoList: [],
    deliveryInfo: [],
    showDeliveryDialog: false,
    dialogBtnLoading: false,
    showEditDeliveryDialog: false,
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, searchParams } = yield select(
        (state) => state.deliveryManageModel
      );
      const { time } = searchParams;
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: {
          ...searchParams,
          deliveryTimeBefore:
            (time && time[0] && moment(time[0]).format("YYYY-MM-DD")) || "",
          deliveryTimeAfter:
            (time && time[1] && moment(time[1]).format("YYYY-MM-DD")) || "",
        },
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.getSendOrderList, params);
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
    *queryInventoryProduct({ payload }, { call, put, select }) {
      const { currentMsg, inventoryPagination, hospitalId } = yield select(
        (state) => state.deliveryManageModel
      );
      const params = {
        current: inventoryPagination.current,
        size: inventoryPagination.size,
        params: {
          hospitalId,
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
    *getDeliveryStatus({ payload }, { call, put }) {
      const { data } = yield call(API.getDeliveryStatus);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            deliveryStatusList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "获取物流状态枚举失败！");
      }
    },

    *getAddInfo({ payload }, { call, put, select }) {
      const { selectedRowKeys } = payload;
      const params = { replenishOrderId: selectedRowKeys.join(",") };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.getSendBsicInfo, params);
      yield put({ type: "save", payload: { loading: false } });
      if (data && data.success) {
        const { data: info } = data;
        const { replenishOrderList, ...others } = info;
        yield put({
          type: "save",
          payload: {
            addDialog: false,
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
    *addGoods({ payload }, { call, put, select }) {
      const {
        selectedRowKeys,
        replenishOrderList,
        scanCode,
        scanCodeProductList,
      } = yield select((state) => state.deliveryManageModel);
      const params = {
        replenishOrderId: selectedRowKeys.join(","),
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
        selectedRowKeys,
        replenishOrderList,
        scanCodeProductList,
      } = yield select((state) => state.deliveryManageModel);
      const params = {
        replenishOrderId: selectedRowKeys.join(","),
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
    *sendOrderSubmit({ payload }, { call, put, select }) {
      const {
        addInfo,
        replenishOrderList,
        scanCodeProductList,
        selectedRowKeys,
      } = yield select((state) => state.deliveryManageModel);
      const serialNoList = (scanCodeProductList || []).map(
        (item) => item.serialNo
      );
      const params = {
        ...addInfo,
        replenishOrderId: selectedRowKeys.join(","),
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
    *querySendOrderDetail({ payload }, { call, put, select }) {
      const { currentMsg } = yield select((state) => state.deliveryManageModel);
      const params = {
        sendOrderId: currentMsg.id,
      };
      const { data } = yield call(API.querySendOrderDetail, params);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            productList: (data.data && data.data.productList) || [],
            basicInfo: data.data || {},
          },
        });
      } else {
        message.error(data.message || "查询详情失败！");
      }
    },
    *queryReplenishProductDetail({ payload }, { call, put, select }) {
      const { data } = yield call(API.queryReplenishProductDetail, payload);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            replenishmentDetailDialog: true,
            replenishmentList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "查询详情失败！");
      }
    },
    *getReplenishList({ payload }, { call, put }) {
      const { data } = yield call(API.getReplenishList);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            replenishTodoList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "获取补货单失败！");
      }
    },
    *getDeliveryInfo({ payload }, { call, put, select }) {
      const { data } = yield call(API.getDeliveryInfo, payload);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            deliveryInfo: data.data || [],
          },
        });
      } else {
        message.error(data.message || "获取物流信息失败！");
      }
    },
    *updateDeliveryInfo({ payload }, { call, put, select }) {
      yield put({ type: "save", payload: { dialogBtnLoading: true } });
      console.log("params", payload);
      const { data } = yield call(API.updateDeliveryInfo, payload);
      yield put({ type: "save", payload: { dialogBtnLoading: false } });
      if (data && data.success) {
        message.success(data.message || "保存成功！");
        yield put({
          type: "save",
          payload: {
            showEditDeliveryDialog: false,
          },
        });
        yield put({ type: "getTableList" });
      } else {
        message.error(data.message || "修改物流信息失败！");
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
