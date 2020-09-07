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
            label="职位名称"
            rules={[{ required: true, message: "请输入职位名称" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="remark" label="职位备注">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="departmentId"
            label="权限"
            rules={[{ required: true, message: "请选择职位权限" }]}
          >
            <Tree
              checkable
              onExpand={this.onExpand}
              expandedKeys={expandedKeys}
              // onSelect={this.onSelect}
              defaultCheckedKeys={data.departmentId || []}
              onCheck={this.onCheck}
              treeData={[
                {
                  icon: "iconwarehouse",
                  key: "home",
                  title: "首页",
                  children: [
                    {
                      key: "hospitalManage",
                      title: "医院管理",
                      children: [],
                    },
                    {
                      key: "departmentManage",
                      title: "科室管理",
                      children: [],
                    },
                  ],
                },
                {
                  icon: "iconfeeds",
                  key: "consumption",
                  title: "消耗单",
                  children: [
                    {
                      key: "test-1",
                      title: "测试-1",
                      children: [],
                    },
                    {
                      key: "test-2",
                      title: "测试-2",
                      children: [],
                    },
                  ],
                },
                {
                  icon: "iconpackaging",
                  key: "replenishment",
                  title: "补货单",
                  children: [],
                },
                {
                  icon: "iconall",
                  key: "inventory",
                  title: "库存管理",
                  children: [],
                },
                {
                  icon: "iconlandtransportation",
                  key: "delivery",
                  title: "物流信息",
                  children: [],
                },
                {
                  icon: "iconcoupons",
                  key: "invoice",
                  title: "自动发票",
                  children: [],
                },
                {
                  icon: "iconcoupons",
                  key: "systemSetting",
                  title: "系统设置",
                  children: [
                    {
                      key: "powerManage",
                      title: "权限管理",
                    },
                    {
                      key: "systemPersonnelManage",
                      title: "系统人员管理",
                    },
                    {
                      key: "wxPersonnelManage",
                      title: "微信人员管理",
                    },
                  ],
                },
                {
                  icon: "iconCustomermanagement",
                  key: "staffing",
                  title: "人员配置",
                  children: [],
                },
                {
                  icon: "iconviewlist",
                  key: "productInfo",
                  title: "产品信息库",
                  children: [],
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default EditDialog;
