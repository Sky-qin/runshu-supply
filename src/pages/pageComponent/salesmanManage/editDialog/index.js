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
    const { userList, customerList } = sourceList;

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
            userId: data.userId,
            isManagers: data.isManagers,
            isLocals: data.isLocals,
          }}
        >
          {title === "编辑" && (
            <Form.Item
              name="userId"
              label="业务员名称"
              rules={[{ required: true }]}
            >
              {data.userName}
            </Form.Item>
          )}
          {title === "新增" && (
            <Form.Item
              name="userId"
              label="业务员名称"
              rules={[{ required: true }]}
            >
              <Select
                dropdownMatchSelectWidth={false}
                showSearch
                optionFilterProp="label"
                options={userList}
                placeholder="请选择"
              />
            </Form.Item>
          )}

          <Form.Item name="isManagers" label="销售经理客户">
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
          <Form.Item name="isLocals" label="属地代表客户">
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
        </Form>
      </Modal>
    );
  }
}

export default EditDialog;
