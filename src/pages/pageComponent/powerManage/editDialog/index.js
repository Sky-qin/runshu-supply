import React from "react";
import { Modal, Form, Input, Button, Tree } from "antd";

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
    const { onOk } = this.props;
    let formObj = this.fromRef;
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
    formObj.current.setFieldsValue({ resourceSigns: checkedChildrenId });
  };

  onExpand = (expandedKeys) => {
    this.setState({ expandedKeys });
  };

  render() {
    const { expandedKeys } = this.state;
    const { title, data, sourceList } = this.props;
    const { resourceList } = sourceList;
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
            roleName: data.roleName || "",
            roleRemark: data.roleRemark || "",
            resourceSigns: data.resourceSigns || [],
          }}
        >
          <Form.Item
            name="roleName"
            label="职位名称"
            rules={[{ required: true, message: "请输入职位名称" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="roleRemark" label="职位备注">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="resourceSigns"
            label="权限"
            rules={[{ required: true, message: "请选择职位权限" }]}
          >
            <Tree
              checkable
              onExpand={this.onExpand}
              expandedKeys={expandedKeys}
              defaultCheckedKeys={data.resourceSigns || []}
              onCheck={this.onCheck}
              treeData={resourceList}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default EditDialog;
