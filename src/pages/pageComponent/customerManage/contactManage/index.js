import React from "react";
import styled from "styled-components";
import { Drawer, Button, Form, Col, Row, Input, Spin, Card } from "antd";

import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const FooterBar = styled.div`
  text-align: center;
  background: #fff;
  position: fixed;
  bottom: 0px;
  right: 0px;
  height: 56px;
  line-height: 56px;
  width: 1100px;
  border-top: 1px solid #ddd;
`;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class ContactManage extends React.Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { onClosed } = this.props;
    onClosed && typeof onClosed === "function" && onClosed();
  };

  onFormChange = (key, value, obj) => {
    const { onChange, data = {} } = this.props;
    const { addInfo = {} } = data;
    let tmp = {};
    if (key === "outStockId") {
      tmp = {
        ...addInfo,
        outStockId: (obj && obj.value) || null,
        outStock: (obj && obj.label) || null,
      };
      onChange &&
        typeof onChange === "function" &&
        onChange({ productList: [] });
    }
    if (key === "inStockId") {
      tmp = {
        ...addInfo,
        inStockId: (obj && obj.value) || null,
        inStock: (obj && obj.label) || null,
      };
    }
    if (key === "remarks") {
      tmp = { ...addInfo, [key]: value };
    }

    onChange &&
      typeof onChange === "function" &&
      onChange({ addInfo: { ...tmp } }, key);
  };

  handleSubmit = () => {
    const { onSubmit } = this.props;
    let formObj = this.formRef;
    formObj.current
      .validateFields()
      .then(() => {
        onSubmit && typeof onSubmit === "function" && onSubmit();
      })
      .catch((errorInfo) => {
        console.log("errorInfo", errorInfo);
        return;
      });
  };

  initValues = (data) => {
    let initInfo = {};
    (data || []).map((item, index) => {
      initInfo[`name${item.unkey}`] = item.name;
      initInfo[`phone${item.unkey}`] = item.phone;
      return null;
    });
    return initInfo;
  };

  handleAdd = () => {
    const { addInfo } = this.props;
    addInfo && typeof addInfo === "function" && addInfo();
  };

  render() {
    const { data = [], loading } = this.props;
    console.log("data", data);
    return (
      <Drawer
        title="联系人管理"
        visible
        width={1100}
        className="drawer-box"
        onClose={this.handleCancel}
        maskClosable={false}
      >
        <Spin spinning={loading || false}>
          <Form
            {...layout}
            ref={this.formRef}
            onFinish={this.onFinish}
            style={{ marginTop: "24px" }}
            initialValues={this.initValues(data)}
          >
            {(data || []).map((node, index) => {
              return (
                <Card key="index" extra={<DeleteOutlined />}>
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        label="姓名"
                        name={`name${index}`}
                        rules={[{ required: true }]}
                      >
                        <Input
                          placeholder="请输入联系人姓名"
                          onChange={(e) =>
                            this.onFormChange("remarks", e.target.value)
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="电话号码" name="remarks">
                        <Input
                          placeholder="请输入电话号码"
                          onChange={(e) =>
                            this.onFormChange("remarks", e.target.value)
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Form.Item label="职位" name="remarks">
                        <Input
                          placeholder="请输入职位"
                          onChange={(e) =>
                            this.onFormChange("remarks", e.target.value)
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="职能" name="remarks">
                        <TextArea
                          rows={3}
                          placeholder="请输入职能"
                          onChange={(e) =>
                            this.onFormChange("remarks", e.target.value)
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              );
            })}
          </Form>
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={() => this.handleAdd()}
          >
            添加联系人
          </Button>
          <FooterBar>
            <Button type="primary" onClick={this.handleSubmit}>
              提交
            </Button>
          </FooterBar>
        </Spin>
      </Drawer>
    );
  }
}

export default ContactManage;
