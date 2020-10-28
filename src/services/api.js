import saveImage$ from "dingtalk-jsapi/api/biz/util/saveImage";
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
   * 首页
   */
  // 首页汇总
  getTodayIndex(params) {
    return request({
      url: `${Prefix}/index/getTodayIndex`,
      params,
    });
  },
  // 折线图
  getStatistics(params) {
    return request({
      url: `${Prefix}/index/getStatistics`,
      method: "post",
      params,
    });
  },

  // top10数据
  getIndexTopTen(params) {
    return request({
      url: `${Prefix}/index/getIndexTop`,
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
      url: `${Prefix}/consumeOrder/selectPCConsumeOrderInfo`,
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

  // 汇总查询
  stockStatistic(params) {
    return request({
      url: `${Prefix}/supply/inventory/stock/statistic`,
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

  // 排序管理
  resourceSorted(params) {
    return request({
      url: `${Prefix}/resource/resourceSorted`,
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
   * 补货单管理
   */

  // 补货单列表
  replenishList(params) {
    return request({
      url: `${Prefix}/replenish/selectReplenishOrderList`,
      method: "post",
      params,
    });
  },
  // 确定补货单
  replenishSure(params) {
    return request({
      url: `${Prefix}/replenish/sure`,
      method: "post",
      params,
    });
  },
  // 撤销补货单
  replenishRollBack(params) {
    return request({
      url: `${Prefix}/replenish/rollBack`,
      method: "post",
      params,
    });
  },

  // 去发货获取基本信息
  getSendBsicInfo(params) {
    return request({
      url: `${Prefix}/sendOrder/sendListShow`,
      params,
    });
  },

  // 扫码添加或手动添加
  addGoods(params) {
    return request({
      url: `${Prefix}/sendOrder/scanCodeSendOrder`,
      method: "post",
      params,
    });
  },

  // 删除商品
  deleteGoods(params) {
    return request({
      url: `${Prefix}/sendOrder/deleteSendOrder`,
      method: "post",
      params,
    });
  },

  // 根据发货人员查手机号
  getMobileById(params) {
    return request({
      url: `${Prefix}/consignor/selectMobileById`,
      params,
    });
  },

  // 提交发货单
  sendOrderSubmit(params) {
    return request({
      url: `${Prefix}/sendOrder/sendOrderSubmit`,
      method: "post",
      params,
    });
  },

  // 发货详情
  getSendOrderInfo(params) {
    return request({
      url: `${Prefix}/replenish/sendOrderInfo`,
      params,
    });
  },

  /**
   * 发货管理
   */
  // 发货列表
  getSendOrderList(params) {
    return request({
      url: `${Prefix}/sendOrder/selectSendOrderList`,
      method: "post",
      params,
    });
  },
  // 查看物流信息
  getDeliveryInfo(params) {
    return request({
      url: `${Prefix}/replenish/selectDeliveryInfo`,
      method: "post",
      params,
    });
  },

  // 补货单详情
  querySendOrderDetail(params) {
    return request({
      url: `${Prefix}/sendOrder/querySendOrderDetail`,
      params,
    });
  },
  // 查看可发货的补货单
  getReplenishList(params) {
    return request({
      url: `${Prefix}/sendOrder/querySendOrderBefore`,
      params,
    });
  },
  // 查看补货单详情
  queryReplenishProductDetail(params) {
    return request({
      url: `${Prefix}/sendOrder/queryReplenishProductDetail`,
      params,
    });
  },

  // 编辑物流信息
  updateDeliveryInfo(params) {
    return request({
      url: `${Prefix}/sendOrder/editSendOrder`,
      method: "post",
      params,
    });
  },

  // 获取补货单医院
  queryReplenishHospitals(params) {
    return request({
      url: `${Prefix}/sendOrder/queryReplenishHospitals`,
      params,
    });
  },

  /**
   * 库位管理
   */
  // 列表
  getStockManageList(params) {
    return request({
      url: `${Prefix}/supply/stock/list`,
      method: "post",
      params,
    });
  },
  /**
   * 供应商管理
   */
  // 列表
  getSupplierManageList(params) {
    return request({
      url: `${Prefix}/supply/supplier/list`,
      method: "post",
      params,
    });
  },

  /**
   * 生产厂家管理
   */
  // 列表
  getVendorManageList(params) {
    return request({
      url: `${Prefix}/supply/vendor/list`,
      method: "post",
      params,
    });
  },

  /**
   * 阳光采购信息维护
   */
  // 区域阳光采购信息表头
  getSunTitle(params) {
    return request({
      url: `${Prefix}/sunlight/findTitle`,
      params,
    });
  },
  // 区域阳光采购表格信息
  getSunList(params) {
    return request({
      url: `${Prefix}/sunlight/findData`,
      method: "post",
      params,
    });
  },

  /**
   *  消息推送管理
   */
  // 推送列表
  selectAllPushMessage(params) {
    return request({
      url: `${Prefix}/pushMessage/selectAllPushMessage`,
      method: "post",
      params,
    });
  },
  // 添加消息推送人员
  addPushPerson(params) {
    return request({
      url: `${Prefix}/pushMessage/insertPushMessageUsers`,
      method: "post",
      params,
    });
  },
  // 删除推送人
  deletePushUser(params) {
    return request({
      url: `${Prefix}/pushMessage/deletePushUser`,
      method: "post",
      params,
    });
  },

  /**
   * 备货单
   */
  // 备货单列表
  prepareList(params) {
    return request({
      url: `${Prefix}/supply/prepare/list`,
      method: "post",
      params,
    });
  },

  // 去备货-继续备货基本信息 备货单列表
  preparePreNew(params) {
    return request({
      url: `${Prefix}/supply/prepare/preNew`,
      params,
    });
  },

  // 添加商品
  prepareScan(params) {
    return request({
      url: `${Prefix}/supply/prepare/scan`,
      method: "post",
      params,
    });
  },

  // 删除商品
  prepareDelete(params) {
    return request({
      url: `${Prefix}/supply/prepare/delete`,
      method: "post",
      params,
    });
  },
  // 详情查看

  // 备货清单
  prepareDetail(params) {
    return request({
      url: `${Prefix}/supply/prepare/detail`,
      params,
    });
  },
  // 备货单提交
  prepareSubmit(params) {
    return request({
      url: `${Prefix}/supply/prepare/submit`,
      params,
      method: "post",
    });
  },

  /**
   * 备货返库
   */
  backStoreList(params) {
    return request({
      url: `${Prefix}/choiceBackStore/query`,
      params,
      method: "post",
    });
  },
  initAddRepareBack(params) {
    return request({
      url: `${Prefix}/choiceBackStore/initAddRepareBack`,
      params,
    });
  },

  // 扫码添加
  backStoreScan(params) {
    return request({
      url: `${Prefix}/choiceBackStore/scan`,
      params,
    });
  },
  // 添加返库单
  addBackOrder(params) {
    return request({
      url: `${Prefix}/choiceBackStore/save`,
      params,
      method: "post",
    });
  },
  // 备货返库详情查询
  queryBackDetailInfo(params) {
    return request({
      url: `${Prefix}/choiceBackStore/queryBackInfo`,
      params,
    });
  },

  /**
   * 调拨管理
   */
  // 调拨列表
  findAllocationList(params) {
    return request({
      url: `${Prefix}/allocation/findAllocationList`,
      params,
      method: "post",
    });
  },

  // 扫码添加
  allocationScan(params) {
    return request({
      url: `${Prefix}/allocation/allocationScan`,
      params,
    });
  },

  // 添加调拨单
  addAllocationOrder(params) {
    return request({
      url: `${Prefix}/allocation/addAllocationOrder`,
      params,
      method: "post",
    });
  },

  // 调拨单详情
  findAllocationById(params) {
    return request({
      url: `${Prefix}/allocation/findAllocationById`,
      params,
    });
  },

  /**
   * 盘点管理
   */
  // 盘点管理列表
  inventoryCheckList(params) {
    return request({
      url: `${Prefix}/inventoryCheck/manage/list`,
      method: "post",
      params,
    });
  },
  // 盘点单详情
  inventoryCheckDetail(params) {
    return request({
      url: `${Prefix}/inventoryCheck/manage/detail`,
      params,
    });
  },
  // 选择库位后下一步
  checkInventory(params) {
    return request({
      url: `${Prefix}/inventoryCheck/manage/selectCheckInventory`,
      method: "post",
      params,
    });
  },
  // 库位解锁、上锁
  stockLockOrUnlock(params) {
    return request({
      url: `${Prefix}/inventoryCheck/manage/stockLockOrUnlock`,
      method: "post",
      params,
    });
  },

  // 扫码添加
  addCheckGood(params) {
    return request({
      url: `${Prefix}/inventoryCheck/manage/check`,
      method: "post",
      params,
    });
  },

  // 盘点信息提交
  sendCheckInfo(params) {
    return request({
      url: `${Prefix}/inventoryCheck/manage/generateInventoryOrder`,
      method: "post",
      params,
    });
  },

  /**
   * 盘盈/亏入库
   */
  // 盘盈入库单列表
  inventoryProfitList(params) {
    return request({
      url: `${Prefix}/allotProductOrder/management/selectSurplusOrder`,
      method: "post",
      params,
    });
  },
  // 盘亏出库单列表
  inventoryLossList(params) {
    return request({
      url: `${Prefix}/allotProductOrder/management/selectLossOrder`,
      method: "post",
      params,
    });
  },
  // 盘盈/亏扫码添加商品
  findProductByScanCode(params) {
    return request({
      url: `${Prefix}/allotProductOrder/management/findProductByScanCode`,
      method: "post",
      params,
    });
  },
  // 添加盘亏单
  addLossOrder(params) {
    return request({
      url: `${Prefix}/allotProductOrder/management/addLossOrder`,
      method: "post",
      params,
    });
  },

  // 添加盘盈单
  addSurplusOrder(params) {
    return request({
      url: `${Prefix}/allotProductOrder/management/addSurplusOrder`,
      method: "post",
      params,
    });
  },
  // 盘盈/亏详情查询
  selectOrderDetail(params) {
    return request({
      url: `${Prefix}/allotProductOrder/management/selectOrderDetail`,
      method: "post",
      params,
    });
  },
  /**
   * 医院在售商品库
   */
  // 医院在售商品列表
  hospitalOnsaleList(params) {
    return request({
      url: `${Prefix}/product/hospitalOnsale/list`,
      method: "post",
      params,
    });
  },

  /**
   * 商品图片管理
   */
  // 图片列表
  imageList(params) {
    return request({
      url: `${Prefix}/product/image/list`,
      method: "post",
      params,
    });
  },

  // 图片管理保存
  saveImage(params) {
    return request({
      url: `${Prefix}/product/image/save`,
      method: "post",
      params,
    });
  },

  // 商品图片删除
  deleteImage(params) {
    return request({
      url: `${Prefix}/product/image/delete`,
      params,
    });
  },

  /**
   * 客户管理
   */
  customerTableList(params) {
    return request({
      url: `${Prefix}/supply/customer/selectList`,
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

  // h获取医院枚举
  replenishHospitals(params) {
    return request({
      url: `${Prefix}/replenish/getHospitals`,
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
  // 产品类别
  queryProductCategoryCommon(params) {
    return request({
      url: `${Prefix}/dic/category/common`,
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
  // 获取用户库位信息
  getUserStock(params) {
    return request({
      url: `${Prefix}/userMessage/getStock`,
      params,
    });
  },
  // 发货人枚举
  getSendPersonList(params) {
    return request({
      url: `${Prefix}/consignor/selectSendPerson`,
      params,
    });
  },
  // 物流状态枚举
  getDeliveryStatus(params) {
    return request({
      url: `${Prefix}/sendOrder/getDeliveryStatus`,
      params,
    });
  },
  // 模糊查询所有库位
  getAllStock(params) {
    return request({
      url: `${Prefix}/userMessage/getStockName`,
      params,
    });
  },
  // 省份下拉枚举
  getProvinceList(params) {
    return request({
      url: `${Prefix}/sunlight/listProvince`,
      method: "post",
      params,
    });
  },
  // 厂家枚举
  productListVendor(params) {
    return request({
      url: `${Prefix}/supply/product/listVendor`,
      params,
    });
  },
  // 消息推送tab枚举
  selectPushMessageType(params) {
    return request({
      url: `${Prefix}/pushMessage/selectPushMessageType`,
      params,
      method: "post",
    });
  },
  // 消息推送用户枚举查询
  selectAllSysUser(params) {
    return request({
      url: `${Prefix}/pushMessage/selectAllSysUser`,
      params,
      method: "post",
    });
  },
  // 盘点状态枚举
  checkStatusList(params) {
    return request({
      url: `${Prefix}/inventoryCheck/manage/checkStatus/list`,
      params,
    });
  },
  // 盘点人下拉枚举
  checkCreatorList(params) {
    return request({
      url: `${Prefix}/inventoryCheck/manage/checkCreator/list`,
      params,
    });
  },

  // 盘点库位下拉枚举
  queryStockList(params) {
    return request({
      url: `${Prefix}/inventoryCheck/manage/queryStock/list`,
      params,
      method: "post",
    });
  },
  // 医院在售商品医院枚举
  hospitalList(params) {
    return request({
      url: `${Prefix}/product/hospitalOnsale/hospital/list`,
      params,
    });
  },
  // 创建人|申请人 枚举查询 type  2:备货单3:备货返库单4:调拨单5:盘盈入库:6盘亏出库
  findUserList(params) {
    return request({
      url: `${Prefix}/allocation/findUserList`,
      params,
    });
  },
  // 个人仓库枚举
  personalStock(params) {
    return request({
      url: `${Prefix}/supply/stock/personal`,
      params,
    });
  },
  // 公司主仓库枚举
  companyStock(params) {
    return request({
      url: `${Prefix}/supply/stock/company`,
      params,
    });
  },
  // 客户枚举
  customerList(params) {
    return request({
      url: `${Prefix}/supply/customer/list`,
      params,
    });
  },
  // all库位查询
  findAllStock(params) {
    return request({
      url: `${Prefix}/allocation/findAllStock`,
      params,
    });
  },
  // 根据产品分类查询生产厂家
  productVendorListbyCategory(params) {
    return request({
      url: `${Prefix}/product/image/productVendor/list`,
      params,
      method: "post",
    });
  },
  // 根据产品分类\厂家查询商品
  productNameList(params) {
    return request({
      url: `${Prefix}/product/image/productName/list`,
      params,
      method: "post",
    });
  },
};

export default API;
