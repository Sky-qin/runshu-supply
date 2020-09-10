import React from "react";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
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
        style={{ width: 240 }}
        defaultSelectedKeys={[activeMenu]}
        // defaultOpenKeys={["sub1"]}
        mode="inline"
      >
        {(data || []).map((item, index) => {
          const { children } = item;
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
        {/* <SubMenu
          key="sub1"
          title={
            <span>
              <MailOutlined />
              <span>Navigation One</span>
            </span>
          }
        ></SubMenu>
        <SubMenu
          key="sub2"
          icon={<i className={`menu-icon iconfont iconwarehouse`} />}
          title="Navigation Two"
        >
          <Menu.Item key="5">Option 5</Menu.Item>
          <Menu.Item key="6">Option 6</Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub4"
          title={
            <span>
              <SettingOutlined />
              <span>Navigation Three</span>
            </span>
          }
        >
          <Menu.Item key="9">Option 9</Menu.Item>
          <Menu.Item key="10">Option 10</Menu.Item>
          <Menu.Item key="11">Option 11</Menu.Item>
          <Menu.Item key="12">Option 12</Menu.Item>
        </SubMenu> */}
      </Menu>
    );
  }
}

export default Header;
