import React from "react";
import { Modal, Form, Button, Select } from "antd";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class AddDialog extends React.Component {
  hospitalRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      planId: null,
      relationName: "",
    };
  }

  handleOk = (e) => {
    const { planId, relationName } = this.state;
    const { onOk } = this.props;
    let formObj = this.hospitalRef;
    formObj.current
      .validateFields()
      .then((values) => {
        onOk &&
          typeof onOk === "function" &&
          onOk({ ...values, planId, relationName });
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
    const { title, sourceList, loading } = this.props;
    const { relationList, planList } = sourceList;
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
        >
          <Form.Item
            name="bizRelationId"
            label="供货关系"
            rules={[{ required: true }]}
          >
            <Select
              options={relationList}
              placeholder="请选择"
              dropdownMatchSelectWidth={false}
              showSearch
              optionFilterProp="label"
              onChange={(value, obj) =>
                this.setState({ relationName: (obj && obj.label) || "" })
              }
            />
          </Form.Item>
          <Form.Item name="planId" label="参考方案">
            <Select
              options={planList}
              placeholder="请输入选择"
              dropdownMatchSelectWidth={false}
              onChange={(value, obj) =>
                this.setState({ planId: (obj && obj.unvalue) || null })
              }
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default AddDialog;
