const corpId = "dingcda3f8b5a069ac58bc961a6cb783455b";

// const localdev = "//192.168.1.175:8081";
// const localdev = "//192.168.1.127:8081";
// const localdev = "//10.0.0.177:8081";
const localdev = "//192.168.1.178:8081";
// const localdev = "https://order.runshutech.com";

const dev = "https://order.runshutech.com";
const prod = "https://supply.runshutech.com";
const API_EVN = process.env.API_EVN;
const Prefix = getApiHost(API_EVN);
const PicPrefix = getPicHost(API_EVN);

function getApiHost(value) {
  if (value === "localdev") {
    return localdev;
  } else if (value === "dev") {
    return dev;
  } else if (value === "prod") {
    return prod;
  }
}

function getPicHost(value) {
  if (value === "localdev") {
    return "https://filesystem.runshutech.com/";
  } else if (value === "dev") {
    return "https://filesystem.runshutech.com/";
  } else if (value === "prod") {
    return "https://fdfs.runshutech.com/";
  }
}

const menuLevel = {
  consumeConfig: { level: 0, text: "消耗管理", code: "consumeConfig" },
  replenishmentMange: {
    level: 0,
    text: "调拨管理",
    code: "replenishmentMange",
  },
  inventoryConfig: { level: 0, text: "库存管理", code: "inventoryConfig" },
  priceManage: { level: 0, text: "价格管理", code: "priceManage" },
  warnInfo: { level: 0, text: "预警通知", code: "warnInfo" },
  productInfo: { level: 0, text: "产品信息库", code: "productInfo" },
  basicConfig: { level: 1, text: "基础数据", code: "basicConfig" },
  systemSetting: { level: 0, text: "系统设置", code: "systemSetting" },
  home: { level: 1, text: "首页", code: "home" },
  consumeList: { level: 1, text: "消耗单", code: "consumeList" },
  feedbackInfoManage: {
    level: 1,
    text: "反馈信息管理",
    code: "feedbackInfoManage",
  },
  replenishment: { level: 1, text: "补货单", code: "replenishment" },
  deliveryManage: { level: 1, text: "发货管理", code: "deliveryManage" },
  shipperManage: { level: 1, text: "发货人管理", code: "shipperManage" },
  stockList: { level: 1, text: "备货单", code: "stockList" },
  stockReturnWarehouse: {
    level: 1,
    text: "备货返库",
    code: "stockReturnWarehouse",
  },
  allocateTransfer: { level: 1, text: "调拨", code: "allocateTransfer" },
  makeInventory: { level: 1, text: "盘点管理", code: "makeInventory" },
  inventoryProfit: { level: 1, text: "盘盈入库", code: "inventoryProfit" },
  inventoryLoss: { level: 1, text: "盘亏出库", code: "inventoryLoss" },
  locationInventory: {
    level: 1,
    text: "库存（按库位）",
    code: "locationInventory",
  },
  realTimeInventory: {
    level: 1,
    text: "库存（按产品）",
    code: "realTimeInventory",
  },
  supplyPriceManage: {
    level: 1,
    text: "供货价格管理",
    code: "supplyPriceManage",
  },
  inventoryWarnInfo: { level: 1, text: "库存预警", code: "inventoryWarnInfo" },
  recentWarnInfo: { level: 1, text: "近效期预警", code: "recentWarnInfo" },
  inventoryWarn: { level: 1, text: "库存预警设置", code: "inventoryWarn" },
  recentWarn: { level: 1, text: "近效期预警设置", code: "recentWarn" },
  hospitalSaleGoods: {
    level: 1,
    text: "医院在售产品库",
    code: "hospitalSaleGoods",
  },
  businessProducts: {
    level: 1,
    text: "公司经营产品库",
    code: "businessProducts",
  },
  oneProductCode: { level: 1, text: "一品一码库", code: "oneProductCode" },
  productLibrary: { level: 1, text: "产品数据库", code: "productLibrary" },
  customerManage: { level: 2, text: "客户管理", code: "customerManage" },
  supplyRelation: { level: 2, text: "供货关系管理", code: "supplyRelation" },
  hospitalManage: { level: 2, text: "医院管理", code: "hospitalManage" },

  departmentManage: { level: 3, text: "科室管理", code: "departmentManage" },

  inventoryManage: { level: 2, text: "仓库管理", code: "inventoryManage" },
  salesmanManage: { level: 2, text: "销售员管理", code: "salesmanManage" },
  supplierManage: { level: 2, text: "供应商管理", code: "supplierManage" },
  manufacturerManage: {
    level: 2,
    text: "生产厂家管理",
    code: "manufacturerManage",
  },
  supplyCompanyManage: {
    level: 2,
    text: "供货公司管理",
    code: "supplyCompanyManage",
  },
  agentManage: { level: 2, text: "代理商管理", code: "agentManage" },
  operationManage: { level: 2, text: "手术管理", code: "operationManage" },
  picManage: { level: 2, text: "商品图片配置", code: "picManage" },
  systemPersonnelManage: {
    level: 1,
    text: "账号管理",
    code: "systemPersonnelManage",
  },
  powerManage: { level: 1, text: "权限管理", code: "powerManage" },
  menuConfig: { level: 1, text: "菜单管理", code: "menuConfig" },
  messagePushManage: {
    level: 1,
    text: "信息推送管理",
    code: "messagePushManage",
  },
  wxPersonnelManage: {
    level: 1,
    text: "医院端小程序账号管理",
    code: "wxPersonnelManage",
  },
};

export { Prefix, corpId, PicPrefix, menuLevel };
