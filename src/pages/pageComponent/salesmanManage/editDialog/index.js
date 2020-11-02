import React from "react";
import { Modal, Form, Input, Button, Cascader, Select, TreeSelect } from "antd";

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

  handleCancel = (e) => {
    const { onClosed } = this.props;
    onClosed && typeof onClosed === "function" && onClosed();
  };

  render() {
    const { title, data, sourceList, loading } = this.props;
    const { adressList, storageList, departmentList } = sourceList;

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
            name: data.name,
            // stockIds: data.stockIds,
            departmentIds: data.departmentIds,
            city: data.city,
            address: data.address,
            person: data.person,
            phone: data.phone,
          }}
        >
          <Form.Item
            name="name"
            label="业务员名称"
            // rules={[{ required: true, message: "请选择供货公司" }]}
          >
            {/* <Select options={[]} placeholder="请选择" allowClear /> */}
            {/* <Input placeholder="请输入" /> */}
            XXXXXXX
          </Form.Item>

          <Form.Item name="name" label="关联客户">
            <Select options={[]} placeholder="请选择" allowClear />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default EditDialog;
