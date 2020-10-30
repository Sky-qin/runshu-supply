import React from "react";
import { Button } from "antd";
import T from "prop-types";
import styled from "styled-components";

const OpreationDiv = styled.div`
  .opreation-bar-inner {
    line-height: 56px;
  }
  .opreation-bar-left {
    flex: auto;
    max-width: 70%;
  }
  .opreation-bar-right {
    flex: 1;
    color: #1890ff;
    text-align: right;
  }
  .button-item {
    margin: 0px 4px;
  }
  .link-item {
    margin: 0px 4px;
    padding: 0px 4px;
  }
`;

class OpreationBar extends React.Component {
  static propTypes = {
    onClick: T.func,
    buttonList: T.array,
    linkList: T.array,
  };
  static defaultProps = {
    onClick: () => {},
    buttonList: [],
    linkList: [],
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  handleClickBtn = (item) => {
    const { key } = item;
    const { onClick } = this.props;
    onClick && typeof onClick === "function" && onClick(key);
  };

  render() {
    const { buttonList, linkList, total = 0, custom } = this.props;
    return (
      <OpreationDiv>
        <div className="opreation-bar-inner" style={{ display: "flex" }}>
          <div className="opreation-bar-left">
            {custom || null}
            {buttonList.map((item, index) => {
              return (
                <Button
                  key={index}
                  type="primary"
                  className="button-item"
                  icon={item.icon || null}
                  onClick={() => this.handleClickBtn(item)}
                >
                  {item.label}
                </Button>
              );
            })}
          </div>
          <div className="opreation-bar-right">
            {linkList.map((item, index) => {
              const { key, url = "", params = {} } = item;
              let aParams = {};
              if (key === "export") {
                aParams = {
                  component: "a",
                  href: `https://order.runshutech.com${url}?${Object.entries(
                    params
                  )
                    .map((item) => item.join("="))
                    .join("&")}`,
                };
              }
              return (
                <Button
                  key={index}
                  type="link"
                  icon={item.icon || null}
                  className="link-item"
                  // onClick={() => this.handleClickBtn(item)}
                  {...aParams}
                >
                  {item.label}
                </Button>
              );
            })}
            {total !== false && (
              <Button type="link" className="link-item">
                共 {total} 条
              </Button>
            )}
          </div>
        </div>
      </OpreationDiv>
    );
  }
}

export default OpreationBar;
