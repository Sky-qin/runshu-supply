import React from "react";
import { Modal, Form, Input, Button } from "antd";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class EditDialog extends React.Component {
  hospitalRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      showEditDialog: false,
    };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    const { onOk } = this.props;
    let formObj = this.hospitalRef;
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

  handleCancel = () => {
    const { onClosed } = this.props;
    onClosed && typeof onClosed === "function" && onClosed();
  };

  render() {
    const { title, data, loading } = this.props;
    return (
      <Modal
        title={title || "编辑"}
        maskClosable={false}
        visible
        onCancel={this.handleCancel}
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
        <Form
          {...layout}
          ref={this.hospitalRef}
          layout="horizontal"
          name="userForm"
          initialValues={{
            companyName: data.companyName,
          }}
        >
          <Form.Item
            name="companyName"
            label="供货公司"
            rules={[{ required: true }]}
          >
            <Input placeholder="请选择" allowClear />
          </Form.Item>

          {/* <Form.Item
            name="name"
            label="客户类型"
            rules={[{ required: true, message: "请选择客户类型   " }]}
          >
            <Select options={[]} placeholder="请选择" allowClear />
          </Form.Item> */}
        </Form>
      </Modal>
    );
  }
}

export default EditDialog;
