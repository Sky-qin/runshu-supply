import React from "react";
import styled from "styled-components";
import { Modal, Timeline } from "antd";

const BasicDiv = styled.div`
  padding-left: 20px;
  padding-bottom: 20px;
  > div {
    margin-right: 20px;
    line-height: 36px;
  }
`;

class DeliveryDialog extends React.Component {
  departmentRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { onClosed } = this.props;
    onClosed && typeof onClosed === "function" && onClosed();
  };

  render() {
    const { title, data } = this.props;
    const { deliveryList = [] } = data;
    return (
      <Modal
        title={title}
        visible
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={false}
      >
        <BasicDiv>
          <div>快递公司：{data.expCompanyName || ""}</div>
          <div>快递单号：{data.expNo || ""}</div>
          <div>物流状态：{data.finalNodeLabel || ""}</div>
        </BasicDiv>
        <Timeline>
          {(deliveryList || []).map((item, index) => {
            return (
              <Timeline.Item key={`item${index}`}>
                <div>{item.nodeLabel}</div>
                {(item.nodeList || []).map((node, index) => {
                  return (
                    <div key={index}>{`${node.nodeTime}——${node.detail}`}</div>
                  );
                })}
              </Timeline.Item>
            );
          })}
        </Timeline>
      </Modal>
    );
  }
}

export default DeliveryDialog;
