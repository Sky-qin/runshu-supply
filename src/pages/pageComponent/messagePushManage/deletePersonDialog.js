import React from "react";
import { Modal, Form, Select, Button } from "antd";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class DeletePersonDialog extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {};
  // }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    const { onOk } = this.props;
    console.log("ssssss");
    onOk && typeof onOk === "function" && onOk();
  };

  handleCancel = (e) => {
    const { onClosed } = this.props;
    onClosed && typeof onClosed === "function" && onClosed();
  };

  handleSearchPerson = (keyword) => {
    const { getPersonList } = this.props;
    getPersonList &&
      typeof getPersonList === "function" &&
      getPersonList(keyword);
  };

  render() {
    const { title, loading, data, dataSource: personList } = this.props;
    return (
      <Modal
        title={title || "编辑"}
        visible
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={[
          <Button key="cancel" onClick={this.handleCancel}>
            取消
          </Button>,
          <Button
            key="ok"
            type="primary"
            loading={loading}
            onClick={this.handleOk}
          >
            确定
          </Button>,
        ]}
      >
        您确定要删除对{data.userName}的消息推送吗？
      </Modal>
    );
  }
}

export default DeletePersonDialog;
