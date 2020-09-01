import React from "react";
import { connect } from "dva";
import { Router, Route, Switch } from "dva/router";
import PropTypes from "prop-types";
import {} from "antd";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import HospitalManage from "../pageComponent/hospitalManage";
import DepartmentManage from "../pageComponent/departmentManage";
import "./index.scss";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: "hospitalManage",
      menuList: [
        {
          icon: "iconwarehouse",
          resourceId: "home",
          resourceName: "首页",
          resources: [
            {
              resourceId: "hospitalManage",
              resourceName: "医院管理",
              resources: [],
            },
            {
              resourceId: "departmentManage",
              resourceName: "科室管理",
              resources: [],
            },
          ],
        },
        {
          icon: "iconfeeds",
          resourceId: "consumption",
          resourceName: "消耗单",
          resources: [
            {
              resourceId: "test-1",
              resourceName: "测试-1",
              resources: [],
            },
            {
              resourceId: "test-2",
              resourceName: "测试-2",
              resources: [],
            },
          ],
        },
        {
          icon: "iconpackaging",
          resourceId: "replenishment",
          resourceName: "补货单",
          resources: [],
        },
        {
          icon: "iconall",
          resourceId: "inventory",
          resourceName: "库存管理",
          resources: [],
        },
        {
          icon: "iconlandtransportation",
          resourceId: "delivery",
          resourceName: "物流信息",
          resources: [],
        },
        {
          icon: "iconcoupons",
          resourceId: "invoice",
          resourceName: "自动发票",
          resources: [],
        },
        {
          icon: "iconcoupons",
          resourceId: "systemSetting",
          resourceName: "系统设置",
          resources: [],
        },
        {
          icon: "iconCustomermanagement",
          resourceId: "staffing",
          resourceName: "人员配置",
          resources: [],
        },
        {
          icon: "iconviewlist",
          resourceId: "productInfo",
          resourceName: "产品信息库",
          resources: [],
        },
      ],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
  }

  handleDown = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "example/downAge",
    });
  };

  clickMenu = (item) => {
    const { history } = this.props;
    if (item.resources && item.resources.length > 0) return;
    this.setState({
      activeKey: item.resourceId,
    });
    this.props.history.push(`/entry/${item.resourceId}`);
  };

  render() {
    const { menuList, activeKey } = this.state;
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

export default connect(({ example }) => ({
  example,
}))(Home);
