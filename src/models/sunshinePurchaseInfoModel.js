import { message, Popover } from "antd";
import styled from "styled-components";
import API from "../services/api";

const WrapSpecifications = styled.div`
  width: 200px;
  > span {
    display: -webkit-box;
    width: 200px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
  }
`;
const WrapDivModel = styled.div`
  width: 200px;
  > span {
    display: -webkit-box;
    width: 200px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
  }
`;

export default {
  namespace: "sunshinePurchaseInfoModel",
  state: {
    currentMsg: {},
    data: [],
    loading: false,
    pagination: {
      current: 1,
      size: 10,
      total: 0,
    },
    province: "LIAO_NING",
    provinceList: [],
    tableTitle: [],
  },

  effects: {
    *getTableList({ payload }, { call, put, select }) {
      const { pagination, keyword, province } = yield select(
        (state) => state.sunshinePurchaseInfoModel
      );
      const { current, size } = pagination;
      let params = {
        current,
        size,
        params: {
          keyword,
          province,
        },
      };
      yield put({ type: "save", payload: { loading: true } });
      const { data } = yield call(API.getSunList, params);
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
    *getProvinceList({ payload }, { call, put }) {
      const { data } = yield call(API.getProvinceList);
      if (data && data.success) {
        yield put({
          type: "save",
          payload: {
            provinceList: data.data || [],
          },
        });
      } else {
        message.error(data.message || "获取省市区域枚举失败！");
      }
    },
    *getSunTitle({ payload }, { call, put, select }) {
      const { province } = yield select(
        (state) => state.sunshinePurchaseInfoModel
      );
      const { data } = yield call(API.getSunTitle, { province });
      if (data && data.success) {
        let tableTitle = [];
        (data.data || []).map((item) => {
          if (item.value === "specifications") {
            tableTitle.push({
              title: item.label,
              dataIndex: item.value,
              key: item.label,
              render: (text) => {
                let formatText = text
                  .replace(/,/g, ", ")
                  .replace(/;/g, "; ")
                  .replace(/\//g, "/ ");
                return (
                  <WrapSpecifications>
                    <Popover
                      placement="left"
                      title="规格"
                      content={
                        <div style={{ width: "300px" }}>{formatText}</div>
                      }
                      trigger="click"
                    >
                      {text}
                    </Popover>
                  </WrapSpecifications>
                );
              },
            });
            return null;
          }
          if (item.value === "model") {
            tableTitle.push({
              title: item.label,
              dataIndex: item.value,
              key: item.label,
              render: (text) => {
                let formatText = text
                  .replace(/,/g, ", ")
                  .replace(/;/g, "; ")
                  .replace(/\//g, "/ ");
                return (
                  <WrapDivModel>
                    <Popover
                      placement="left"
                      title="型号"
                      content={
                        <div style={{ width: "300px" }}>{formatText}</div>
                      }
                      trigger="click"
                    >
                      {text}
                    </Popover>
                  </WrapDivModel>
                );
              },
            });
            return null;
          }
          tableTitle.push({
            title: item.label,
            dataIndex: item.value,
            key: item.label,
          });
          return null;
        });
        yield put({
          type: "save",
          payload: {
            tableTitle,
          },
        });
      } else {
        message.error(data.message || "获取省市区域枚举失败！");
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
