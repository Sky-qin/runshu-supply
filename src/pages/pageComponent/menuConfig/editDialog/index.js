import React from "react";
import { Modal, Form, Input, Button, Spin } from "antd";

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
    const { dialogTitle, data } = this.props;
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
          <Button key="ok" type="primary" onClick={this.handleOk}>
            确定
          </Button>,
        ]}
      >
        {/* <Spin> */}
        <Form
          {...layout}
          ref={this.departmentRef}
          layout="horizontal"
          initialValues={{
            resourceName: data.resourceName,
            resourceSign: data.resourceSign,
            icon: data.icon,
          }}
        >
          <Form.Item
            name="resourceName"
            label="菜单名称"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="resourceSign"
            label="菜单标识"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          {data.parentId === 0 && (
            <Form.Item
              name="icon"
              label="菜单图标"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          )}
        </Form>
        {/* </Spin> */}
      </Modal>
    );
  }
}

export default EditDialog;
