import React from "react";
import T from "prop-types";

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

  handleConfig = () => {};

  render() {
    return (
      <div className="header-bar">
        <div className="header-bar-left">图标位置</div>
        <div className="header-bar-right">
          <img
            className="user-pic"
            src="http://himg.bdimg.com/sys/portrait/item/b0e3e7a7a6e69687e9be9930353238df2d.jpg"
          />
          <div className="user-info">
            <div className="user-name">阿文</div>
            <div className="user-postion">主管</div>
          </div>
          <i
            onClick={this.handleConfig}
            className="config-user-icon iconfont iconxiala"
          />
        </div>
      </div>
    );
  }
}

export default Header;
