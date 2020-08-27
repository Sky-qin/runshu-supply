import React from "react";
import { Router, Route, Switch, Redirect } from "dva/router";
import Entry from "./pages/entry/index";
import Login from "./pages/login/index";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/entry" exact component={Entry} />
        <Redirect from="/" to="/login"></Redirect>
      </Switch>
    </Router>
  );
}

export default RouterConfig;
