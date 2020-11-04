import React from "react";
import { Modal, Form, Button, Select, Input, TreeSelect } from "antd";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class EditDialog extends React.Component {
  customerRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      showEditDialog: false,
    };
  }

  handleChangeForm = (value, key) => {
    let { current: searchForm } = this.customerRef;
    const { onFormChange } = this.props;
    onFormChange &&
      typeof onFormChange === "function" &&
      onFormChange(value, key, searchForm.setFieldsValue);
  };

  handleOk = (e) => {
    const { onOk } = this.props;
    let formObj = this.customerRef;
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
    const { customerTypeList, departmentList, hospitalList } = sourceList;
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
          ref={this.customerRef}
          layout="horizontal"
          name="userForm"
          initialValues={{
            name: data.name || null,
            type: data.type || null,
            hospitalId: data.hospitalId || null,
            departmentId: data.departmentId,
          }}
        >
          <Form.Item name="name" label="客户名称" rules={[{ required: true }]}>
            <Input
              placeholder="请输入"
              allowClear
              onChange={(e) => this.handleChangeForm(e.target.value, "name")}
            />
          </Form.Item>

          <Form.Item name="type" label="客户类型" rules={[{ required: true }]}>
            <Select
              options={customerTypeList}
              placeholder="请选择"
              allowClear
              onChange={(value) => this.handleChangeForm(value, "type")}
            />
          </Form.Item>

          {data.type === "3" && (
            <>
              <Form.Item name="hospitalId" label="关联医院">
                <Select
                  options={hospitalList}
                  placeholder="请选择"
                  onChange={(value) =>
                    this.handleChangeForm(value, "hospitalId")
                  }
                  allowClear
                />
              </Form.Item>
              <Form.Item name="departmentId" label="医院下科室">
                <TreeSelect
                  filterTreeNode
                  treeNodeFilterProp="label"
                  placeholder="请选择科室"
                  treeData={departmentList}
                  onChange={(value) =>
                    this.handleChangeForm(value, "departmentId")
                  }
                />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    );
  }
}

export default EditDialog;
