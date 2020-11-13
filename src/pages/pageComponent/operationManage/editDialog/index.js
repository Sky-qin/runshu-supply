import React from "react";
import { Modal, Form, Input, Button } from "antd";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class EditDialog extends React.Component {
  fromRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOk = (e) => {
    const { onOk } = this.props;
    let formObj = this.fromRef;
    formObj.current
      .validateFields()
      .then((values) => {
        onOk && typeof onOk === "function" && onOk({ ...values, type: "dd" });
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

  /* 自定义的一些函数 */
  // onSelect = (selectedKeys, info) => {
  //   console.log("selected", selectedKeys, info);
  // };

  onCheck = (checkedKeys, info) => {
    let formObj = this.fromRef;
    let checkedChildrenId = [];
    (info.checkedNodes || []).map((item) => {
      if (item.children && item.children.length > 0) return null;
      return checkedChildrenId.push(item.key);
    });
    formObj.current.setFieldsValue({ departmentId: checkedChildrenId });
  };

  render() {
    const { title, data } = this.props;
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
          <Button key="ok" type="primary" onClick={this.handleOk}>
            确定
          </Button>,
        ]}
      >
        <Form
          {...layout}
          ref={this.fromRef}
          layout="horizontal"
          initialValues={{
            operationType: data.operationType || "",
          }}
        >
          <Form.Item
            name="operationType"
            label="手术类型"
            rules={[{ required: true }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default EditDialog;
