import React from "react";
import { connect } from "dva";
import { Button } from "antd";
import T from "prop-types";
import ContentWrap from "../../../components/contentWrap";
import "./index.scss";

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // this.handleLogin();
  }

  render() {
    return <ContentWrap>ssss</ContentWrap>;
  }
}

export default connect(({ loginModel }) => ({
  loginModel,
}))(Test);
