import React from "react";
import {} from "antd";
import {
  CloseOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import "./index.scss";

const ContentDiv = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  background: rgba(0, 0, 0, 0.45);
  height: 100%;
  width: 100%;
  > ul {
    height: 46px;
    background: rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    padding-right: 15px;
    font-size: 14px;
    line-height: 1.5715;
    position: absolute;
    z-index: 1;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    width: 100%;
    color: hsla(0, 0%, 100%, 0.85);
    list-style: none;
    > li {
      padding: 12px;
      cursor: pointer;
    }
  }
  .img-view {
    width: 100%;
    height: 100%;
    text-align: center;
    > img {
      max-width: 100%;
      max-height: 100%;
      vertical-align: middle;
    }
  }
`;

class PreviewImge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  // handleClick = ({ key }) => {
  //   const { clickMenu } = this.props;
  //   this.setState({ activeNode: key });
  //   clickMenu && typeof clickMenu === "function" && clickMenu(key);
  // };
  handleClose = () => {
    const { onClose } = this.props;
    onClose && typeof onClose === "function" && onClose();
  };

  render() {
    const { src, visible } = this.props;
    if (!visible) return null;
    return (
      <ContentDiv>
        <ul>
          <li>
            <CloseOutlined onClick={this.handleClose} />
          </li>
          {/* <li>
            <RotateRightOutlined />
          </li>
          <li>
            <RotateLeftOutlined />
          </li> */}
        </ul>
        <div className="img-view">
          <img src={src} />
        </div>
      </ContentDiv>
    );
  }
}

export default PreviewImge;
