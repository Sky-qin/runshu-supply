import React from "react";
import T from "prop-types";

import "./index.scss";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  handleClick = (item) => {
    const { clickMenu } = this.props;
    const { value } = item;
    this.setState({ activeNode: value });
    clickMenu && typeof clickMenu === "function" && clickMenu(item);
  };

  handleClickChild = (item) => {
    const { clickMenu } = this.props;
    clickMenu && typeof clickMenu === "function" && clickMenu(item);
  };

  getMenuClass = (item) => {
    const { activeMenu } = this.props;
    let isActive = false;
    if (item.value === activeMenu) {
      isActive = true;
    }
    (item.children || []).map((node) => {
      if (node.value === activeMenu) {
        isActive = true;
      }
    });
    return `menu-item ${isActive ? "active-menu" : ""}`;
  };

  randerDirectionIcon = (item) => {
    const { activeNode } = this.state;
    const { children } = item;
    if (children && children.length > 0) {
      return (
        <div className="direction-icon">
          {activeNode === item.value ? (
            <i className="iconfont iconxiangyou1" />
          ) : (
            <i className="iconfont iconback" />
          )}
        </div>
      );
    }
  };

  render() {
    const { data, activeMenu } = this.props;
    const { activeNode } = this.state;
    return (
      <div className="menu-bar">
        {(data || []).map((item) => {
          return (
            <div key={item.value}>
              <div
                className={this.getMenuClass(item)}
                onClick={() => this.handleClick(item)}
              >
                <i className={`menu-icon iconfont ${item.icon}`} />
                <span className="menu-name">{item.label}</span>
                {this.randerDirectionIcon(item)}
              </div>
              {activeNode === item.value &&
                (item.children || []).map((item) => {
                  return (
                    <div key={item.value}>
                      <div
                        key={item.value}
                        className={`children-menu-item ${
                          activeMenu === item.value
                            ? "children-active-menu"
                            : ""
                        }`}
                        onClick={() => this.handleClickChild(item)}
                      >
                        <span className="menu-name children-menu">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Header;
