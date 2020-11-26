import React from "react";
import { Router, Route, Switch, Redirect } from "dva/router";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import Entry from "./pages/entry";
import Login from "./pages/login";

function RouterConfig({ history }) {
  return (
    <ConfigProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route path="/entry" component={Entry} />
          <Redirect from="/" to="/login" />
        </Switch>
      </Router>
    </ConfigProvider>
  );
}

export default RouterConfig;
