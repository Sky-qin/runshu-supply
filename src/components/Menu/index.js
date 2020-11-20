import React from "react";
import { Menu } from "antd";
import "./index.scss";

const { SubMenu } = Menu;

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  handleClick = ({ key }) => {
    const { clickMenu } = this.props;
    this.setState({ activeNode: key });
    clickMenu && typeof clickMenu === "function" && clickMenu(key);
  };

  render() {
    const { data, activeMenu } = this.props;
    return (
      <Menu
        onClick={this.handleClick}
        style={{ width: 240, overflowY: "scroll", overflowX: "hidden" }}
        selectedKeys={[activeMenu]}
        mode="inline"
      >
        {(data || []).map((item, index) => {
          const { children, value } = item;
          // 基础数据做了特殊处理
          if (value === "basicConfig") {
            return (
              <Menu.Item
                key={item.value}
                icon={<i className={`menu-icon iconfont ${item.icon}`} />}
              >
                {item.label}
              </Menu.Item>
            );
          }
          if (children && children.length > 0) {
            return (
              <SubMenu
                key={item.value}
                icon={<i className={`menu-icon iconfont ${item.icon}`} />}
                title={item.label}
              >
                {(children || []).map((node) => {
                  return <Menu.Item key={node.value}>{node.label}</Menu.Item>;
                })}
              </SubMenu>
            );
          }
          return (
            <Menu.Item
              key={item.value}
              icon={<i className={`menu-icon iconfont ${item.icon}`} />}
            >
              {item.label}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  }
}

export default Header;
