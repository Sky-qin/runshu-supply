import React from "react";
import T from "prop-types";

import "./index.scss";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeNode: "",
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
  }

  handleClick = (item) => {
    const { clickMenu } = this.props;
    const { resourceId } = item;
    this.setState({ activeNode: resourceId });
    clickMenu && typeof clickMenu === "function" && clickMenu(item);
  };

  handleClickChild = (item) => {
    const { clickMenu } = this.props;
    clickMenu && typeof clickMenu === "function" && clickMenu(item);
  };

  getMenuClass = (item) => {
    const { activeMenu } = this.props;
    let isActive = false;
    if (item.resourceId === activeMenu) {
      isActive = true;
    }
    (item.resources || []).map((node) => {
      if (node.resourceId === activeMenu) {
        isActive = true;
      }
    });
    return `menu-item ${isActive ? "active-menu" : ""}`;
  };

  randerDirectionIcon = (item) => {
    const { activeNode } = this.state;
    const { resources } = item;
    if (resources && resources.length > 0) {
      return (
        <div className="direction-icon">
          {activeNode === item.resourceId ? (
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
            <div key={item.resourceId}>
              <div
                className={this.getMenuClass(item)}
                onClick={() => this.handleClick(item)}
              >
                <i className={`menu-icon iconfont ${item.icon}`} />
                <span className="menu-name">{item.resourceName}</span>
                {this.randerDirectionIcon(item)}
              </div>
              {activeNode === item.resourceId &&
                (item.resources || []).map((item) => {
                  return (
                    <div key={item.resourceId}>
                      <div
                        key={item.resourceId}
                        className={`children-menu-item ${
                          activeMenu === item.resourceId
                            ? "children-active-menu"
                            : ""
                        }`}
                        onClick={() => this.handleClickChild(item)}
                      >
                        <span className="menu-name children-menu">
                          {item.resourceName}
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
