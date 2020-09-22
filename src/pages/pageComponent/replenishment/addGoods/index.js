import React from "react";
import styled from "styled-components";
import { Drawer, Button, Table, Form, Select, Col, Row, Input } from "antd";
// const SerialPort = require("serialport");
// import SerialPort from "serialport";

const { Column } = Table;
const { TextArea } = Input;
// SerialPort.list()
//   .then((ports) => {
//     // 假设选择第一个串口实例化
//     let path = ports[0].comName;
//     let myPort = new SerialPort(path);
//   })
//   .catch((err) => console.log(err));
const BasicDiv = styled.div`
  padding-top: 20px;
  margin-bottom: 50px;
`;

const WrapTitle = styled.div`
  font-size: 18px;
  line-height: 30px;
  display: flex;
  padding: 5px 0px;
  .berfore-bar {
    height: 30px;
    width: 4px;
    background: #1890ff;
    margin-right: 4px;
  }
`;

const FooterBar = styled.div`
  text-align: center;
  background: #fff;
  position: fixed;
  bottom: 0px;
  right: 0px;
  height: 56px;
  line-height: 56px;
  width: 900px;
  border-top: 1px solid #ddd;
`;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class AddGoods extends React.Component {
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
    let tmp = { ...addInfo, [key]: value };
    if (key === "orderStatus") {
      tmp = { ...tmp, phone: obj.phone };
    }
    onChange &&
      typeof onChange === "function" &&
      onChange({ addInfo: { ...addInfo, ...tmp } });
  };

  handleAddGoods = () => {};

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

  render() {
    const { data = {} } = this.props;
    const { addInfo = {} } = data;
    return (
      <Drawer
        title="发货单"
        visible
        width={900}
        className="drawer-box"
        onClose={this.handleCancel}
        maskClosable={false}
      >
        <Form
          {...layout}
          ref={this.formRef}
          onFinish={this.onFinish}
          style={{ marginTop: "24px" }}
        >
          <Row>
            <Col span={8}>
              <Form.Item label="发货单号:">{"sssss"}</Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="日期:">{"sssss"}</Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="调出仓库:">{"sssss"}</Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item label="调入仓库:">{"sssss"}</Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="调拨类型:">{"sssss"}</Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="客户:">{"sssss"}</Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item label="快递单号:" name="hospitalId">
                <Input
                  onChange={(e) =>
                    this.onFormChange("hospitalId", e.target.value)
                  }
                  placeholder="请输入快递单号"
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="发货人:" name="orderStatus">
                <Select
                  placeholder="请选择"
                  options={[{ value: 1, label: "xxx", phone: "222222" }]}
                  onChange={(value, obj) =>
                    this.onFormChange("orderStatus", value, obj)
                  }
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="手机号:" name="phone">
                <Input placeholder="发货人手机号" disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item label="简介:" name="consumeName">
                <TextArea
                  rows={3}
                  placeholder="请输入简介"
                  onChange={(e) =>
                    this.onFormChange("consumeName", e.target.value)
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div>
          <WrapTitle>
            <span className="berfore-bar" />
            <span className="group-title">补货单</span>
          </WrapTitle>
          <Table
            bordered
            scroll={{ y: 400 }}
            dataSource={[]}
            rowKey="productCode"
            pagination={false}
          >
            <Column title="源单编码" dataIndex="" width={130} />
            <Column title="产品编码" dataIndex="" width={180} />
            <Column title="产品名称" dataIndex="" width={120} />
            <Column title="规格" dataIndex="model" width={100} />
            <Column title="型号" dataIndex="" width={80} />
            <Column title="单价" dataIndex="" width={100} />
            <Column title="生产厂家" dataIndex="" width={100} />
            <Column title="补货数量" dataIndex="" width={100} />
            <Column title="已补数量" dataIndex="" width={100} />
            <Column title="未补数量" dataIndex="" width={100} />
          </Table>
        </div>
        <BasicDiv>
          <WrapTitle>
            <span className="berfore-bar" />
            <span className="group-title">发货清单</span>
          </WrapTitle>
          <div style={{ padding: "8px" }}>
            流水号:
            <Input
              style={{ width: "650px", marginLeft: "12px" }}
              onChange={(e) => console.log("value", e.target.value)}
              allowClear
            />
            <Button
              type="primary"
              style={{ position: "relative", left: "-3px" }}
              onClick={this.handleAddGoods}
            >
              添加商品
            </Button>
          </div>
          <Table
            bordered
            scroll={{ y: 400 }}
            dataSource={[]}
            rowKey="productCode"
            pagination={false}
          >
            <Column
              title="序号"
              render={(value, record, index) => index + 1}
              width={80}
            />
            <Column title="流水号" dataIndex="" width={130} />
            <Column title="产品编码" dataIndex="productCode" width={130} />
            <Column title="产品名称" dataIndex="productName" width={180} />
            <Column title="规格" dataIndex="model" width={120} />
            <Column title="型号" dataIndex="" width={100} />
            <Column title="单位" dataIndex="unitName" width={80} />
            <Column title="单价" dataIndex="" width={100} />
            <Column title="生产厂家" dataIndex="" width={150} />
            <Column title="源单编码" dataIndex="" width={120} />
          </Table>
        </BasicDiv>
        <FooterBar>
          <Button type="primary" onClick={this.handleSubmit}>
            提交
          </Button>
        </FooterBar>
      </Drawer>
    );
  }
}

export default AddGoods;
