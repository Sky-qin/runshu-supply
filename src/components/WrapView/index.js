import React from "react";
import { Breadcrumb } from "antd";

class WrapView extends React.Component {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  cliclkToPages = (item, index, len) => {
    const { history } = this.props;
    const { code } = item;
    if (len - 1 === index) return;
    history.push(`/entry/${code}`);
  };

  render() {
    const { children } = this.props;
    const routeKeyList = JSON.parse(
      window.localStorage.getItem("routeKeyList")
    );
    const len = routeKeyList.length || 0;
    return (
      <div>
        {len > 1 && (
          <Breadcrumb
            style={{
              background: "#fff",
              paddingLeft: "15px",
              lineHeight: "32px",
            }}
          >
            {(routeKeyList || []).map((item, index) => {
              return (
                <Breadcrumb.Item
                  style={{ cursor: "pointer" }}
                  key={item.code}
                  onClick={() => this.cliclkToPages(item, index, len)}
                >
                  {item.text}
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb>
        )}
        {children}
      </div>
    );
  }
}

export default WrapView;
