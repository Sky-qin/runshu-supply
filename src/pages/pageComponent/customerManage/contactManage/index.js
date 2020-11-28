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

  onFormChange = (key, value, index) => {
    const { onChange, data = {} } = this.props;
    data[index][key] = value;
    onChange && typeof onChange === "function" && onChange(data);
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
      initInfo[`contact${item.unkey}`] = item.contact;
      initInfo[`phone${item.unkey}`] = item.phone;
      initInfo[`position${item.unkey}`] = item.position;
      initInfo[`jobContent${item.unkey}`] = item.jobContent;
      return null;
    });
    return initInfo;
  };

  handleAdd = () => {
    const { addInfo } = this.props;
    addInfo && typeof addInfo === "function" && addInfo();
  };

  handleDelete = (index, unkey) => {
    const { data, onDelete } = this.props;

    data.splice(index, 1);
    onDelete && typeof onDelete === "function" && onDelete(data);
  };

  render() {
    const { data = [], loading } = this.props;
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
                <Card
                  style={{ marginBottom: "10px" }}
                  key={index}
                  extra={
                    <Button
                      type="link"
                      onClick={() => this.handleDelete(index, node.unkey)}
                    >
                      <DeleteOutlined />
                    </Button>
                  }
                >
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        label="姓名"
                        name={`contact${node.unkey}`}
                        rules={[{ required: true }]}
                      >
                        <Input
                          placeholder="请输入联系人姓名"
                          onChange={(e) =>
                            this.onFormChange("contact", e.target.value, index)
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="电话号码" name={`phone${node.unkey}`}>
                        <Input
                          placeholder="请输入电话号码"
                          onChange={(e) =>
                            this.onFormChange("phone", e.target.value, index)
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Form.Item label="职位" name={`position${node.unkey}`}>
                        <Input
                          placeholder="请输入职位"
                          onChange={(e) =>
                            this.onFormChange("position", e.target.value, index)
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="职能" name={`jobContent${node.unkey}`}>
                        <TextArea
                          rows={3}
                          placeholder="请输入职能"
                          onChange={(e) =>
                            this.onFormChange(
                              "jobContent",
                              e.target.value,
                              index
                            )
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
