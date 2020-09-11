import React from "react";
import { Carousel, Modal, Image } from "antd";
import styled from "styled-components";
import "./index.scss";

const ImgViewCard = styled.div`
  width: 100%;
  height: 400px;
  .view-box {
    height: 360px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const WrapImage = styled(Image)`
  > img {
    max-width: 460px;
    max-height: 360px;
  }
`;

const DotDiv = styled.div`
  text-align: center;
  line-height: 40px;
  > span {
    display: inline-block;
    width: 20px;
    height: 8px;
    border-radius: 8px;
    margin: 0 3px;
    cursor: pointer;
    background: #ccc;
  }
  > span:hover {
    background: #eee;
  }
  .active-dot {
    background: #1890ff !important;
    width: 25px;
  }
`;

class DialogCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 0,
    };
  }

  componentDidMount() {}

  handleClose = () => {
    const { onClose } = this.props;
    this.setState({ activeKey: 0 });
    onClose && typeof onClose === "function" && onClose();
  };

  render() {
    const { visible, data, title = "预览" } = this.props;
    const { activeKey } = this.state;
    if (!visible) return null;
    return (
      <Modal
        title={title}
        visible={visible}
        onCancel={this.handleClose}
        footer={false}
      >
        <ImgViewCard>
          <div className="view-box">
            <WrapImage src={data[activeKey]} />
          </div>
          <DotDiv>
            {(data || []).map((item, index) => {
              return (
                <span
                  className={`${activeKey === index ? "active-dot" : ""}`}
                  key={index}
                  onClick={() => this.setState({ activeKey: index })}
                />
              );
            })}
          </DotDiv>
        </ImgViewCard>
      </Modal>
    );
  }
}

export default DialogCarousel;
