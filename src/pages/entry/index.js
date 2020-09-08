import React from "react";
import { connect } from "dva";
import { Router, Route, Switch, ConfigProvider } from "dva/router";

import PropTypes from "prop-types";
import {} from "antd";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import HospitalManage from "../pageComponent/hospitalManage";
import DepartmentManage from "../pageComponent/departmentManage";
import PowerManage from "../pageComponent/powerManage";
import SystemPersonnelManage from "../pageComponent/systemPersonnelManage";
import WxPersonnelManage from "../pageComponent/wxPersonnelManage";
import ConsumeList from "../pageComponent/consumeList";
import Inventory from "../pageComponent/inventory";
import ProductInfo from "../pageComponent/productInfo";

import "./index.scss";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // activeKey: "home",
      // menuList: [
      //   {
      //     icon: "iconwarehouse",
      //     resourceId: "home",
      //     resourceName: "首页",
      //     resources: [],
      //   },
      //   {
      //     icon: "iconfeeds",
      //     resourceId: "consumeList",
      //     resourceName: "消耗单",
      //   },
      //   {
      //     icon: "iconpackaging",
      //     resourceId: "replenishment",
      //     resourceName: "补货单",
      //     resources: [],
      //   },
      //   {
      //     icon: "iconall",
      //     resourceId: "inventory",
      //     resourceName: "库存管理",
      //     resources: [],
      //   },
      //   {
      //     icon: "iconlandtransportation",
      //     resourceId: "delivery",
      //     resourceName: "物流信息",
      //     resources: [],
      //   },
      //   {
      //     icon: "iconcoupons",
      //     resourceId: "invoice",
      //     resourceName: "自动发票",
      //     resources: [],
      //   },
      //   {
      //     icon: "iconcoupons",
      //     resourceId: "systemSetting",
      //     resourceName: "系统设置",
      //     resources: [
      //       {
      //         resourceId: "powerManage",
      //         resourceName: "权限管理",
      //       },
      //       {
      //         resourceId: "systemPersonnelManage",
      //         resourceName: "系统人员管理",
      //       },
      //       {
      //         resourceId: "wxPersonnelManage",
      //         resourceName: "微信人员管理",
      //       },
      //       {
      //         resourceId: "hospitalManage",
      //         resourceName: "医院管理",
      //         resources: [],
      //       },
      //       {
      //         resourceId: "departmentManage",
      //         resourceName: "科室管理",
      //         resources: [],
      //       },
      //     ],
      //   },
      //   {
      //     icon: "iconCustomermanagement",
      //     resourceId: "staffing",
      //     resourceName: "人员配置",
      //     resources: [],
      //   },
      //   {
      //     icon: "iconviewlist",
      //     resourceId: "productInfo",
      //     resourceName: "产品信息库",
      //     resources: [],
      //   },
      // ],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "entryModel/queryMenu" });
  }

  clickMenu = (item) => {
    const { history, dispatch } = this.props;
    if (item.children && item.children.length > 0) return;
    dispatch({ type: "entryModel/save", payload: { activeKey: item.value } });
    this.props.history.push(`/entry/${item.value}`);
  };

  render() {
    const { menuList, activeKey } = this.props.entryModel;
    return (
      <div>
        <Header />
        <div className="content-wrap">
          <Menu
            clickMenu={this.clickMenu}
            data={menuList}
            activeMenu={activeKey}
          />
          <div className="content-right">
            <Switch>
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
              <Route path="/entry/inventory" component={Inventory} />
              <Route path="/entry/productInfo" component={ProductInfo} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  name: PropTypes.string,
};

export default connect(({ entryModel }) => ({
  entryModel,
}))(Home);
