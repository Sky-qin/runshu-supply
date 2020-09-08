import React from "react";
// import { connect } from "dva";
import { Button } from "antd";
import LoginUtil from "../../utils/loginUtil";
import "./index.scss";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    LoginUtil({
      callBack: this.handleToEntery,
    });
  }

  handleToEntery = () => {
    this.props.history.push("/entry");
  };

  handleLogin = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "loginModel/login",
    });
  };

  render() {
    return (
      <div>
        <Button onClick={() => this.handleLogin()}>sss</Button>
      </div>
    );
  }
}

export default Login;
