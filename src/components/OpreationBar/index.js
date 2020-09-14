import React from "react";
import {} from "antd";
import styled from "styled-components";

const OpreationDiv = styled.div`
  .opreation-bar-inner {
    height: 56px;
    line-height: 56px;
  }
  .opreation-bar-left {
    flex: 1;
  }
  .opreation-bar-right {
    flex: 1;
    color: #1890ff;
    text-align: right;
  }
`;

class OpreationBar extends React.Component {
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
    const { buttonList, linkList } = this.props;
    return (
      <OpreationDiv>
        <div className="opreation-bar-inner" style={{ display: "flex" }}>
          <div className="opreation-bar-left"></div>
          <div className="opreation-bar-right">
            {linkList.map((item, index) => {
              return <div>共 {item.total} 条</div>;
            })}
          </div>
        </div>
      </OpreationDiv>
    );
  }
}

export default OpreationBar;
