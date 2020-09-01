import React from "react";
import { Router, Route, Switch, Redirect } from "dva/router";
import Entry from "./pages/entry";
import Login from "./pages/login";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/entry" component={Entry} />
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
