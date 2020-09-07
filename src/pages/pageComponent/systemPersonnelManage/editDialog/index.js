import React from "react";
import { Modal, Form, Input, Button, Tree, Select } from "antd";

const { TextArea } = Input;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class EditDialog extends React.Component {
  fromRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
    };
  }

  handleOk = (e) => {
    let formObj = this.fromRef;
    formObj.current
      .validateFields()
      .then((values) => {
        console.log(values);
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
      if (item.children && item.children.length > 0) return;
      checkedChildrenId.push(item.key);
    });
    formObj.current.setFieldsValue({ departmentId: checkedChildrenId });
  };

  onExpand = (expandedKeys) => {
    this.setState({ expandedKeys });
  };

  render() {
    const { expandedKeys } = this.state;
    const { title, data, sourceList } = this.props;
    const {} = sourceList;
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
            name: data.name || "",
            remark: data.remark || "",
            departmentId: data.departmentId || [],
          }}
        >
          <Form.Item
            name="name"
            label="用户名"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
            rules={[{ required: true, message: "请输入手机号" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="position"
            label="职位"
            rules={[{ required: true, message: "请选择职位" }]}
          >
            <Select showArrow options={[]} />
          </Form.Item>

          <Form.Item label="区域">
            <Select showArrow options={[]} />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default EditDialog;
