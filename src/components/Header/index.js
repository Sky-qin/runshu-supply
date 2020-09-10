import React from "react";
import Logo from "../../assets/logo.png";
import UserPic from "../../assets/user.png";

import "./index.scss";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showUserMenu: false,
    };
  }

  componentDidMount() {}

  render() {
    const userInfo = JSON.parse(window.localStorage.getItem("user")) || {};
    return (
      <div className="header-bar">
        <div className="header-bar-left">
          <img style={{ height: "44px" }} className="logo-pic" src={Logo} />
        </div>
        <div className="header-bar-right">
          <img className="user-pic" src={userInfo.avatar || UserPic} />
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
