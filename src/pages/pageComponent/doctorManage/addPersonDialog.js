import React from "react";
import { Modal, Form, Input, Button } from "antd";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class AddPersonDialog extends React.Component {
  departmentRef = React.createRef();

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
    let formObj = this.departmentRef;
    formObj.current
      .validateFields()
      .then((values) => {
        onOk && typeof onOk === "function" && onOk(values);
      })
      .catch((errorInfo) => {
        console.log("errorInfo", errorInfo);
        return;
      });
  };

  handleCancel = (e) => {
    const { onClosed } = this.props;
    onClosed && typeof onClosed === "function" && onClosed();
  };

  render() {
    const { title, loading, data } = this.props;
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
        <Form {...layout} ref={this.departmentRef} layout="horizontal">
          <Form.Item label="医院">{data.hospitalName}</Form.Item>
          <Form.Item
            name="doctorName"
            label="医生姓名"
            rules={[{ required: true }]}
          >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default AddPersonDialog;
