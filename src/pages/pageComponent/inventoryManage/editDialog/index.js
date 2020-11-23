import React from "react";
import { Modal, Form, Button, Select, Input } from "antd";

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
      type: (this.props.data && this.props.data.type) || null,
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
    const { type } = this.state;
    const { stockTypeList, customerList } = sourceList;

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
            name: data.name || null,
            type: (data.type && data.type.toString()) || null,
            customerIds: data.customerIdList || [],
          }}
        >
          <Form.Item name="name" label="仓库名称" rules={[{ required: true }]}>
            <Input placeholder="请输入" allowClear />
          </Form.Item>

          <Form.Item name="type" label="仓库类别" rules={[{ required: true }]}>
            <Select
              options={stockTypeList}
              placeholder="请选择"
              allowClear
              onChange={(value) => this.setState({ type: value })}
              disabled={!!data.id}
            />
          </Form.Item>

          {(type || "").toString() === "11908" && (
            <Form.Item
              name="customerIds"
              label="关联客户"
              rules={[{ required: true }]}
            >
              <Select
                options={customerList}
                placeholder="请选择"
                dropdownMatchSelectWidth={false}
                showSearch
                optionFilterProp="label"
                mode="multiple"
                allowClear
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    );
  }
}

export default EditDialog;
