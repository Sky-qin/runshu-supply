import { Prefix } from "../utils/config";
import request from "./request";

const Domain = "//192.168.1.127:8081";

const API = {
  // TODO DELETE
  miniGetInfo(params) {
    return request({
      url: `${Prefix}/mini/getinfo`,
      params,
    });
  },
  miniPostInfo(params) {
    return request({
      url: `${Prefix}/mini/postInfo`,
      method: "post",
      params,
    });
  },

  /**
   * 科室管理
   */
  queryDepartment(params) {
    return request({
      url: `${Domain}/department/query`,
      method: "post",
      params,
    });
  },
  // 新增部门
  addDepartment(params) {
    return request({
      url: `${Domain}/department/save`,
      method: "post",
      params,
    });
  },
  // 编辑部门接口
  editDepartment(params) {
    return request({
      url: `${Domain}/department/update`,
      method: "post",
      params,
    });
  },
  // 删除接口
  deleteDepartment(params) {
    return request({
      url: `${Domain}/department/delete`,
      method: "post",
      params,
    });
  },

  /**
   * 医院管理
   */

  // 医院报个查询
  queryHospital(params) {
    return request({
      url: `${Domain}/hospital/query`,
      method: "post",
      params,
    });
  },
  // 新增医院
  saveHospital(params) {
    return request({
      url: `${Domain}/hospital/save`,
      method: "post",
      params,
    });
  },
  // 编辑医院
  updateHospital(params) {
    return request({
      url: `${Domain}/hospital/update`,
      method: "post",
      params,
    });
  },

  // 删除医院
  deleteHospital(params) {
    return request({
      url: `${Domain}/hospital/delete`,
      method: "post",
      params,
    });
  },

  /**
   * 消耗单管理
   */

  // 消耗单列表查询
  queryConsumeList(params) {
    return request({
      url: `${Domain}/consumeOrder/selectAllConsumeOrder`,
      method: "post",
      params,
    });
  },

  // 消耗单状态修改
  updateConsumeStatus(params) {
    return request({
      url: `${Domain}/consumeOrder/updateStatus`,
      method: "post",
      params,
    });
  },

  // 获取详情
  getConsumeDetail(params) {
    return request({
      url: `${Domain}/consumeOrder/selectConsumeOrderInfo`,
      params,
    });
  },

  /**
   * 枚举类即接口
   */
  // 医院枚举
  getHospital(params) {
    return request({
      url: `${Domain}/consumeOrder/selectAllHospital`,
      method: "post",
      params,
    });
  },

  // 根据医院查科室
  getDePartmentByHsp(params) {
    return request({
      url: `${Domain}/consumeOrder/selectDepartment`,
      params,
    });
  },

  // 申请人接口
  getApplicant(params) {
    return request({
      url: `${Domain}/consumeOrder/selectConsumeUser`,
      method: "post",
      params,
    });
  },

  // 订单状态
  getOrderStatus(params) {
    return request({
      url: `${Domain}/consumeOrder/selectOrderStatus`,
      method: "post",
      params,
    });
  },

  // 城市枚举
  getAddress(params) {
    return request({
      url: `${Domain}/hospital/queryCity`,
      params,
    });
  },
  // 库位枚举
  storageList(params) {
    return request({
      url: `${Domain}/hospital/queryStock`,
      params,
    });
  },
  // 科室枚举
  departmentList(params) {
    return request({
      url: `${Domain}/hospital/queryDepartment`,
      params,
    });
  },
};

export default API;
