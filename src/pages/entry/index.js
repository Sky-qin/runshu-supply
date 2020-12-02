import React from "react";
import { connect } from "dva";
import { Route, Switch } from "dva/router";
import PropTypes from "prop-types";
import { menuLevel } from "../../utils/config";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import Home from "../pageComponent/home";
import HospitalManage from "../pageComponent/hospitalManage";
import DepartmentManage from "../pageComponent/departmentManage";
import PowerManage from "../pageComponent/powerManage";
import SystemPersonnelManage from "../pageComponent/systemPersonnelManage";
import WxPersonnelManage from "../pageComponent/wxPersonnelManage";
import ConsumeList from "../pageComponent/consumeList";
import RealTimeInventory from "../pageComponent/realTimeInventory";
import Inventory from "../pageComponent/inventory";
import ProductLibrary from "../pageComponent/productLibrary";
import FeedbackInfoManage from "../pageComponent/feedbackInfoManage";
import MenuConfig from "../pageComponent/menuConfig";
import BusinessProducts from "../pageComponent/businessProducts";
import Replenishment from "../pageComponent/replenishment";
import OneProductCode from "../pageComponent/oneProductCode";
import DeliveryManage from "../pageComponent/deliveryManage";
import ShipperManage from "../pageComponent/shipperManage";
import RecentWarn from "../pageComponent/recentWarn";
import RecentWarnInfo from "../pageComponent/recentWarnInfo";
import InventoryWarnInfo from "../pageComponent/inventoryWarnInfo";
import InventoryWarn from "../pageComponent/inventoryWarn";
import InventoryManage from "../pageComponent/inventoryManage";
import SupplierManage from "../pageComponent/supplierManage";
import ManufacturerManage from "../pageComponent/manufacturerManage";
import SunshinePurchaseInfo from "../pageComponent/sunshinePurchaseInfo";
import SunshinePurchasePriceInfo from "../pageComponent/sunshinePurchaseInfo";
import StockList from "../pageComponent/stockList";
import MessagePushManage from "../pageComponent/messagePushManage";
import StockReturnWarehouse from "../pageComponent/stockReturnWarehouse";
import MakeInventory from "../pageComponent/makeInventory";
import HospitalSaleGoods from "../pageComponent/hospitalSaleGoods";
import InventoryProfit from "../pageComponent/inventoryProfit";
import InventoryLoss from "../pageComponent/inventoryLoss";
import PicManage from "../pageComponent/picManage";
import CustomerManage from "../pageComponent/customerManage";
import AllocateTransfer from "../pageComponent/allocateTransfer";
import SupplyPriceManage from "../pageComponent/supplyPriceManage";
import SupplyCompanyManage from "../pageComponent/supplyCompanyManage";
import AgentManage from "../pageComponent/agentManage";
import SalesmanManage from "../pageComponent/salesmanManage";
import SupplyRelation from "../pageComponent/supplyRelation";
import OperationManage from "../pageComponent/operationManage";
import BasicConfig from "../pageComponent/basicConfig";

import "./index.scss";

class Entry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.props.history.listen((route) => {
      const routeKey = route.pathname.split("/").slice(-1)[0];
      let routeKeyList =
        JSON.parse(window.localStorage.getItem("routeKeyList")) || [];
      const codeIndex = routeKeyList.findIndex(
        (item) => item.code === menuLevel[routeKey].code
      );
      if (menuLevel[routeKey].level === 1) {
        localStorage.setItem(
          "routeKeyList",
          JSON.stringify([menuLevel[routeKey]])
        );
        return;
      }
      if (codeIndex === -1) {
        routeKeyList.push(menuLevel[routeKey]);
        localStorage.setItem("routeKeyList", JSON.stringify(routeKeyList));
      }
      if (codeIndex !== -1) {
        let tmpList = routeKeyList.slice(0, codeIndex + 1);
        localStorage.setItem("routeKeyList", JSON.stringify(tmpList));
      }
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { activeKey } = this.props.entryModel;

    dispatch({ type: "entryModel/queryMenu" });
    this.clickMenu(activeKey);
  }

  clickMenu = (key) => {
    const { history, dispatch } = this.props;
    const { menuList } = this.props.entryModel;
    dispatch({ type: "entryModel/save", payload: { activeKey: key } });
    history.push(`/entry/${key}`);
    // 基础数据做特色处理
    if (key === "basicConfig") {
      menuList.map((item) => {
        return (
          item.value === key &&
          dispatch({
            type: "basicConfigModel/save",
            payload: { list: item.children },
          })
        );
      });
    }
  };

  render() {
    const { menuList, activeKey } = this.props.entryModel;
    return (
      <div>
        <Header />
        <div className="content-wrap">
          {menuList && menuList.length > 0 && (
            <Menu
              clickMenu={this.clickMenu}
              data={menuList}
              activeMenu={activeKey}
            />
          )}
          <div className="content-right">
            <Switch>
              <Route path="/entry/home" component={Home} />
              <Route path="/entry/hospitalManage" component={HospitalManage} />
              <Route
                path="/entry/departmentManage"
                component={DepartmentManage}
              />
              <Route path="/entry/powerManage" component={PowerManage} />
              <Route
                path="/entry/systemPersonnelManage"
                component={SystemPersonnelManage}
              />
              <Route
                path="/entry/wxPersonnelManage"
                component={WxPersonnelManage}
              />
              <Route path="/entry/consumeList" component={ConsumeList} />
              <Route path="/entry/locationInventory" component={Inventory} />
              <Route
                path="/entry/realTimeInventory"
                component={RealTimeInventory}
              />
              <Route path="/entry/productLibrary" component={ProductLibrary} />
              <Route
                path="/entry/feedbackInfoManage"
                component={FeedbackInfoManage}
              />
              <Route path="/entry/menuConfig" component={MenuConfig} />
              <Route
                path="/entry/businessProducts"
                component={BusinessProducts}
              />
              <Route path="/entry/replenishment" component={Replenishment} />
              <Route path="/entry/oneProductCode" component={OneProductCode} />
              <Route path="/entry/deliveryManage" component={DeliveryManage} />
              <Route path="/entry/shipperManage" component={ShipperManage} />
              <Route path="/entry/recentWarn" component={RecentWarn} />
              <Route path="/entry/recentWarnInfo" component={RecentWarnInfo} />
              <Route
                path="/entry/inventoryWarnInfo"
                component={InventoryWarnInfo}
              />
              <Route path="/entry/inventoryWarn" component={InventoryWarn} />
              <Route
                path="/entry/inventoryManage"
                component={InventoryManage}
              />
              <Route path="/entry/supplierManage" component={SupplierManage} />
              <Route
                path="/entry/manufacturerManage"
                component={ManufacturerManage}
              />
              <Route
                path="/entry/sunshinePurchaseInfo"
                component={SunshinePurchaseInfo}
              />
              <Route
                path="/entry/sunshinePurchasePriceInfo"
                component={SunshinePurchasePriceInfo}
              />
              <Route path="/entry/stockList" component={StockList} />
              <Route
                path="/entry/messagePushManage"
                component={MessagePushManage}
              />
              <Route
                path="/entry/stockReturnWarehouse"
                component={StockReturnWarehouse}
              />
              <Route path="/entry/makeInventory" component={MakeInventory} />
              <Route
                path="/entry/hospitalSaleGoods"
                component={HospitalSaleGoods}
              />
              <Route
                path="/entry/inventoryProfit"
                component={InventoryProfit}
              />
              <Route path="/entry/inventoryLoss" component={InventoryLoss} />
              <Route path="/entry/picManage" component={PicManage} />
              <Route path="/entry/customerManage" component={CustomerManage} />
              <Route
                path="/entry/allocateTransfer"
                component={AllocateTransfer}
              />
              <Route
                path="/entry/supplyPriceManage"
                component={SupplyPriceManage}
              />
              <Route
                path="/entry/supplyCompanyManage"
                component={SupplyCompanyManage}
              />
              <Route path="/entry/agentManage" component={AgentManage} />
              <Route path="/entry/salesmanManage" component={SalesmanManage} />
              <Route path="/entry/supplyRelation" component={SupplyRelation} />
              <Route
                path="/entry/operationManage"
                component={OperationManage}
              />
              <Route path="/entry/basicConfig" component={BasicConfig} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

Entry.propTypes = {
  name: PropTypes.string,
};

export default connect(({ entryModel, basicConfigModel }) => ({
  entryModel,
  basicConfigModel,
}))(Entry);
