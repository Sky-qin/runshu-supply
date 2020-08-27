import React from "react";
import { connect } from "dva";
import { Button } from "antd";

import T from "prop-types";
import "./index.scss";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  handleLogin = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "loginModel/login",
    });
  };

  handleDown = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "example/downAge",
    });
  };

  render() {
    const { age } = this.props.example;
    console.log(this.props);
    return (
      <div>
        LOGIN
        <Button onClick={() => this.handleLogin()}>sss</Button>
        {age}
      </div>
    );
  }
}

export default connect(({ loginModel, example }) => ({
  loginModel,
  example,
}))(Login);
