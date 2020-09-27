import React from "react";
import { Modal, Form, Input, Button, Select } from "antd";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class EditDeliveryDialog extends React.Component {
  departmentRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

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
    const { dialogTitle, data, loading, personList } = this.props;
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
            expNo: data.expNo,
            deliveryUserId: data.deliveryUserId,
          }}
        >
          <Form.Item name="expNo" label="快递单号" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="发货人" name="deliveryUserId">
            <Select placeholder="请选择" options={personList} />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default EditDeliveryDialog;
