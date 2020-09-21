import { Prefix } from "../utils/config";
import request from "./request";

// const Prefix = "//192.168.1.127:8081";
// const Prefix = "//218.24.35.107:8081";
const API = {
  /**
   * 获取菜单列表
   */
  queryMenu(params) {
    return request({
      url: `${Prefix}/auth/ding/user/queryMenu`,
      method: "post",
      params,
    });
  },
  /**
   * 科室管理
   */
  queryDepartment(params) {
    return request({
      url: `${Prefix}/department/query`,
      method: "post",
      params,
    });
  },
  // 新增部门
  addDepartment(params) {
    return request({
      url: `${Prefix}/department/save`,
      method: "post",
      params,
    });
  },
  // 编辑部门接口
  editDepartment(params) {
    return request({
      url: `${Prefix}/department/update`,
      method: "post",
      params,
    });
  },
  // 删除接口
  deleteDepartment(params) {
    return request({
      url: `${Prefix}/department/delete`,
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
      url: `${Prefix}/hospital/query`,
      method: "post",
      params,
    });
  },
  // 新增医院
  saveHospital(params) {
    return request({
      url: `${Prefix}/hospital/save`,
      method: "post",
      params,
    });
  },
  // 编辑医院
  updateHospital(params) {
    return request({
      url: `${Prefix}/hospital/update`,
      method: "post",
      params,
    });
  },

  // 删除医院
  deleteHospital(params) {
    return request({
      url: `${Prefix}/hospital/delete`,
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
      url: `${Prefix}/consumeOrder/selectAllConsumeOrder`,
      method: "post",
      params,
    });
  },

  // 消耗单状态修改
  updateConsumeStatus(params) {
    return request({
      url: `${Prefix}/consumeOrder/updateStatus`,
      method: "post",
      params,
    });
  },

  // 获取详情
  getConsumeDetail(params) {
    return request({
      url: `${Prefix}/consumeOrder/selectConsumeOrderInfo`,
      params,
    });
  },

  /**
   * 职位管理
   */
  // 表格数据查询
  queryRole(params) {
    return request({
      url: `${Prefix}/role/query`,
      method: "post",
      params,
    });
  },
  // 新增职位
  saveRole(params) {
    return request({
      url: `${Prefix}/role/save`,
      method: "post",
      params,
    });
  },
  // 编辑职位
  updateRole(params) {
    return request({
      url: `${Prefix}/role/update`,
      method: "post",
      params,
    });
  },
  // 职位删除
  deleteRole(params) {
    return request({
      url: `${Prefix}/role/delete`,
      method: "post",
      params,
    });
  },
  // 修改状态

  changeRoleStatus(params) {
    return request({
      url: `${Prefix}/role/state`,
      method: "post",
      params,
    });
  },

  /**
   * 产品信息库
   */
  queryProductList(params) {
    return request({
      url: `${Prefix}/supply/product/list`,
      method: "post",
      params,
    });
  },

  /**
   * 库存管理
   */
  // 库存列表
  queryInventoryList(params) {
    return request({
      url: `${Prefix}/supply/inventory/list`,
      method: "post",
      params,
    });
  },
  // 库存商品
  queryInventoryProduct(params) {
    return request({
      url: `${Prefix}/supply/inventory/product`,
      method: "post",
      params,
    });
  },

  // 即时库存
  realInventoryList(params) {
    return request({
      url: `${Prefix}/supply/inventory/amount`,
      method: "post",
      params,
    });
  },

  // 商品库位库存统计
  productStock(params) {
    return request({
      url: `${Prefix}/supply/inventory/amount/stock`,
      method: "post",
      params,
    });
  },

  /**
   * 系统人员管理
   */
  // 查询用户
  queryUser(params) {
    return request({
      url: `${Prefix}/user/query`,
      method: "post",
      params,
    });
  },

  // 新增用户
  saveUser(params) {
    return request({
      url: `${Prefix}/user/save`,
      method: "post",
      params,
    });
  },

  // 编辑用户
  updateUser(params) {
    return request({
      url: `${Prefix}/user/update`,
      method: "post",
      params,
    });
  },

  // 删除用户
  deleteUser(params) {
    return request({
      url: `${Prefix}/user/delete`,
      method: "post",
      params,
    });
  },

  /**
   * 反馈消耗单
   */
  getFeedbackList(params) {
    return request({
      url: `${Prefix}/consumeOrder/selectRemarkList`,
      method: "post",
      params,
    });
  },

  getFeedbackDetail(params) {
    return request({
      url: `${Prefix}/consumeOrder/selectRemark`,
      params,
    });
  },

  updateFeedbackStatus(params) {
    return request({
      url: `${Prefix}/consumeOrder/updateFeedbackStatus`,
      method: "post",
      params,
    });
  },

  /**
   * 菜单管理
   */
  // 菜单列表
  getResourceList(params) {
    return request({
      url: `${Prefix}/resource/selectResourceList`,
      params,
    });
  },

  // 添加菜单
  insertResource(params) {
    return request({
      url: `${Prefix}/resource/insertResource`,
      method: "post",
      params,
    });
  },
  // 编辑菜单
  updateResource(params) {
    return request({
      url: `${Prefix}/resource/updateResource`,
      method: "post",
      params,
    });
  },
  // 删除
  deleteResource(params) {
    return request({
      url: `${Prefix}/resource/deleteResource`,
      method: "post",
      params,
    });
  },

  /**
   * 在售商品管理
   */
  // 表格查询
  onSaleProduct(params) {
    return request({
      url: `${Prefix}/supply/product/onsale/list`,
      method: "post",
      params,
    });
  },

  /**
   * 一品一码
   */
  oneProductCodeList(params) {
    return request({
      url: `${Prefix}/supply/inventory/listInventory`,
      method: "post",
      params,
    });
  },

  /**
   * 发件人管理
   */
  // 发件人列表
  getShipperList(params) {
    return request({
      url: `${Prefix}/consignor/selectPageConsignor`,
      method: "post",
      params,
    });
  },
  // 发件人编辑
  updateConsignor(params) {
    return request({
      url: `${Prefix}/consignor/updateConsignor`,
      method: "post",
      params,
    });
  },
  // 新增发件人
  insertConsignor(params) {
    return request({
      url: `${Prefix}/consignor/insertConsignor`,
      method: "post",
      params,
    });
  },
  // 新增发件人
  deleteConsignor(params) {
    return request({
      url: `${Prefix}/consignor/deleteConsignor`,
      method: "post",
      params,
    });
  },

  /**
   * 预警相关页面
   */

  // 预警设置列表
  findProductBySetWarning(params) {
    return request({
      url: `${Prefix}/userMessage/findProductBySetWarning`,
      method: "post",
      params,
    });
  },
  // 近效期预警信息列表
  findPeriodWarning(params) {
    return request({
      url: `${Prefix}/userMessage/findPeriodWarning`,
      method: "post",
      params,
    });
  },
  // 库存预警信息列表
  findStockWarning(params) {
    return request({
      url: `${Prefix}/userMessage/findStockWarning`,
      method: "post",
      params,
    });
  },
  // 查看商品
  findProductByWarning(params) {
    return request({
      url: `${Prefix}/userMessage/findProductByWarning`,
      method: "post",
      params,
    });
  },
  // 设置预警保存
  setWarning(params) {
    return request({
      url: `${Prefix}/userMessage/setWarning`,
      method: "post",
      params,
    });
  },

  // 删除预警设置
  deleteWarning(params) {
    return request({
      url: `${Prefix}/userMessage/deleteWarning`,
      method: "post",
      params,
    });
  },

  /**
   * 枚举类即接口
   */
  // 获取当前用户 医院枚举
  getHospital(params) {
    return request({
      url: `${Prefix}/consumeOrder/selectAllHospital`,
      method: "post",
      params,
    });
  },

  // 获取所有医院枚举
  getAllHospital(params) {
    return request({
      url: `${Prefix}/user/queryHospital`,
      params,
    });
  },

  // 角色枚举
  queryUserRole(params) {
    return request({
      url: `${Prefix}/user/queryRole`,
      params,
    });
  },

  // 根据医院查科室
  getDePartmentByHsp(params) {
    return request({
      url: `${Prefix}/consumeOrder/selectDepartment`,
      params,
    });
  },

  // 申请人接口
  getApplicant(params) {
    return request({
      url: `${Prefix}/consumeOrder/selectConsumeUser`,
      method: "post",
      params,
    });
  },

  // 消耗单状态
  getOrderStatus(params) {
    return request({
      url: `${Prefix}/consumeOrder/selectOrderStatus`,
      method: "post",
      params,
    });
  },
  // 消耗单pc状态
  getOrderPCStatus(params) {
    return request({
      url: `${Prefix}/consumeOrder/selectPCOrderStatus`,
      method: "post",
      params,
    });
  },

  // 城市枚举
  getAddress(params) {
    return request({
      url: `${Prefix}/hospital/queryCity`,
      params,
    });
  },
  // 库位枚举
  storageList(params) {
    return request({
      url: `${Prefix}/hospital/queryStock`,
      params,
    });
  },
  // 科室枚举
  departmentList(params) {
    return request({
      url: `${Prefix}/hospital/queryDepartment`,
      params,
    });
  },

  // 获取菜单枚举
  queryResource(params) {
    return request({
      url: `${Prefix}/role/queryResource`,
      params,
    });
  },
  // 产品类别
  queryProductCategory(params) {
    return request({
      url: `${Prefix}/dic/category`,
      params,
    });
  },
  // 补货单状态枚举
  replenishStatus(params) {
    return request({
      url: `${Prefix}/replenish/getStatus`,
      params,
    });
  },
};

export default API;
