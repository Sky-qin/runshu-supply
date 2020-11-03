import React from "react";
import { Modal, Form, Button, Select } from "antd";

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
    const { title, data, sourceList, loading } = this.props;
    const { supplyList, customerList, agencyList } = sourceList;

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
            supplyCompanyId: data.supplyCompanyId || null,
            customerId: data.customerId || null,
            agencyCompanyId: data.agencyCompanyId || null,
          }}
        >
          <Form.Item
            name="supplyCompanyId"
            label="客户名称"
            rules={[{ required: true }]}
          >
            <Select options={supplyList} placeholder="请选择" allowClear />
          </Form.Item>

          <Form.Item
            name="customerId"
            label="客户类型"
            rules={[{ required: true }]}
          >
            <Select options={customerList} placeholder="请选择" allowClear />
          </Form.Item>
          <Form.Item name="agencyCompanyId" label="关联医院">
            <Select options={agencyList} placeholder="请选择" allowClear />
          </Form.Item>
          <Form.Item name="agencyCompanyId" label="医院下科室">
            <Select options={agencyList} placeholder="请选择" allowClear />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default EditDialog;
