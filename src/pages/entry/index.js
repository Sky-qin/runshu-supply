import React from "react";
import { connect } from "dva";
import { Route, Switch } from "dva/router";
import PropTypes from "prop-types";
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
import FeedbackInfoManage from "../pageComponent/feedbackInfoManage";
import MenuConfig from "../pageComponent/menuConfig";

import "./index.scss";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "entryModel/queryMenu" });
  }

  clickMenu = (key) => {
    const { history, dispatch } = this.props;
    dispatch({ type: "entryModel/save", payload: { activeKey: key } });
    history.push(`/entry/${key}`);
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
              <Route
                path="/entry/feedbackInfoManage"
                component={FeedbackInfoManage}
              />
              <Route path="/entry/menuConfig" component={MenuConfig} />
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
