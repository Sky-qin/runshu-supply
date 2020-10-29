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
            stockIds: data.stockIds,
            departmentIds: data.departmentIds,
            city: data.city,
            address: data.address,
            person: data.person,
            phone: data.phone,
          }}
        >
          <Form.Item
            name="name"
            label="医院名称"
            rules={[{ required: true, message: "请输入医院名称" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="stockIds"
            label="库位"
            rules={[{ required: true, message: "请选择医院库位" }]}
          >
            <Select mode="multiple" showArrow options={storageList} />
          </Form.Item>
          <Form.Item
            name="departmentIds"
            label="科室"
            rules={[{ required: true, message: "请选择科室" }]}
          >
            <TreeSelect
              filterTreeNode
              treeCheckable
              treeNodeFilterProp="label"
              placeholder="请选择科室"
              multiple
              treeData={departmentList}
            />
          </Form.Item>
          <Form.Item
            name="city"
            label="城市"
            rules={[{ required: true, message: "请现在城市" }]}
          >
            <Cascader placeholder="请选择" options={adressList} />
          </Form.Item>
          <Form.Item
            name="address"
            label="地址"
            rules={[{ required: true, message: "请输入详细地址" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="person" label="联系人">
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ pattern: /^1\d{10}$/, message: "请输入完整的手机号码" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default EditDialog;
