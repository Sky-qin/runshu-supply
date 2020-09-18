import React from "react";
import { Modal, Form, Input, Button } from "antd";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class EditDialog extends React.Component {
  departmentRef = React.createRef();

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
    const { dialogTitle, data, loading } = this.props;
    return (
      <Modal
        title={dialogTitle || "编辑"}
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
        <Form
          {...layout}
          ref={this.departmentRef}
          layout="horizontal"
          initialValues={{
            consignorName: data.consignorName,
            consignorPhone: data.consignorPhone,
          }}
        >
          <Form.Item
            name="consignorName"
            label="发货人姓名"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="consignorPhone"
            label="发货人手机号"
            rules={[
              { required: true, message: "请输入发货人手机号" },
              { pattern: /^1\d{10}$/, message: "请输入完整的手机号" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default EditDialog;
