import React from "react";
import styled from "styled-components";
import { Modal, Button } from "antd";

const BasicDiv = styled.div`
  padding-left: 30px;
  line-height: 48px;
`;

class FeedbackDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { onClose } = this.props;
    onClose && typeof onClose === "function" && onClose();
  };

  handleEdit = (msg, text, status) => {
    const { dispatch } = this.props;
    dispatch({
      type: "consumeModel/save",
      payload: {
        clickStatus: status,
        statusTitle: text,
        showStatusDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  renderFooter = (status = 0) => {
    let list = [];
    if (status === 0) {
      list.push();
      list = [
        <Button key="cancel" onClick={() => this.handleEdit(status, "处理")}>
          处理
        </Button>,
      ];
    }
    if (status === 1) {
      list = [
        <Button
          key="ok"
          type="primary"
          onClick={() => this.handleEdit(status, "撤销")}
        >
          撤销
        </Button>,
      ];
    }
    return list;
  };

  handleChangeStatus = (status) => {
    const { onChange } = this.props;
    if (status === 1) {
      onChange && typeof onChange === "function" && onChange(2);
    }
    if (status === 2) {
      onChange && typeof onChange === "function" && onChange(1);
    }
  };

  render() {
    const { data } = this.props;
    const {
      consumeNumber = "",
      remark = "",
      userName = "",
      feedbackTime = "",
      feedbackStatusDesc = "",
      feedUserName = "",
      feedbackStatus = 0,
    } = data;
    return (
      <Modal
        title="反馈详情"
        visible
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={[
          <Button
            key="back"
            type="primary"
            onClick={() => this.handleChangeStatus(feedbackStatus)}
          >
            {feedbackStatus === 0 ? "处理" : "撤销"}
          </Button>,
        ]}
      >
        <BasicDiv>
          <div>
            消耗单号：<span>{consumeNumber || ""}</span>
          </div>
          <div>
            反馈信息：<span>{remark || ""}</span>
          </div>
          <div>
            提交人：<span>{userName || ""}</span>
          </div>
          <div>
            提交时间：<span>{feedbackTime || ""}</span>
          </div>
          <div>
            状态：<span>{feedbackStatusDesc || ""}</span>
          </div>
          <div>
            反馈处理人：<span>{feedUserName || ""}</span>
          </div>
        </BasicDiv>
      </Modal>
    );
  }
}

export default FeedbackDialog;
