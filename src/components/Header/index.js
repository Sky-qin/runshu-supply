import React from "react";
// import T from "prop-types";
import Logo from "../../assets/logo.png";

import "./index.scss";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showUserMenu: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
  }

  // handleConfig = () => {};

  render() {
    const userInfo = JSON.parse(window.localStorage.getItem("user")) || {};
    // avata
    return (
      <div className="header-bar">
        <div className="header-bar-left">
          <img className="logo-pic" src={Logo} />
        </div>
        <div className="header-bar-right">
          <img
            className="user-pic"
            src={
              userInfo.avatar ||
              "http://himg.bdimg.com/sys/portrait/item/b0e3e7a7a6e69687e9be9930353238df2d.jpg"
            }
          />
          <div className="user-info">
            <div className="user-name">{userInfo.name || ""}</div>
            <div className="user-postion" title={userInfo.position || ""}>
              {userInfo.position || ""}
            </div>
          </div>
          {/* <i
            onClick={this.handleConfig}
            className="config-user-icon iconfont iconxiala"
          /> */}
        </div>
      </div>
    );
  }
}

export default Header;
