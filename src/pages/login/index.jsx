import React from "react";
// import { connect } from "dva";
import LoginUtil from "../../utils/loginUtil";
import LoginPic from "../../assets/login.gif";
import styled from "styled-components";

import "./index.scss";

const PageDiv = styled.div`
  height: 100vh;
  width: 100vw;
  text-align: center;
  > img {
    margin-top: calc(50vh - 200px);
  }
`;

const ErrorDiv = styled.div`
  line-height: 100vh;
  font-size: "50px";
  color: "red";
`;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      showError: false,
      errorText: "",
    };
  }

  componentDidMount() {
    LoginUtil({
      callBack: this.handleToEntery,
    });
  }

  handleToEntery = (res) => {
    this.setState({
      loading: false,
    });
    if (res && res.success) {
      this.props.history.push("/entry");
    } else {
      this.setState({
        showError: true,
        errorText: res.message || "登录异常，请关闭应该重试！",
      });
    }
  };

  handleLogin = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "loginModel/login",
    });
  };

  render() {
    const { loading, showError, errorText } = this.state;
    return (
      <PageDiv>
        {loading && <img alt="loading" src={LoginPic} />}
        {showError && (
          <ErrorDiv style={{ fontSize: "24px", color: "#999" }}>
            {errorText}
          </ErrorDiv>
        )}
      </PageDiv>
    );
  }
}

export default Login;
