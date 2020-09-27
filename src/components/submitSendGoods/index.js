import React from "react";
import styled from "styled-components";
import {
  Drawer,
  Button,
  Table,
  Form,
  Select,
  Col,
  Row,
  Input,
  message,
  Space,
  Spin,
} from "antd";

const { Column } = Table;
const { TextArea } = Input;

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
  width: 1000px;
  border-top: 1px solid #ddd;
`;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class SubmitSendGoods extends React.Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { onClosed } = this.props;
    onClosed && typeof onClosed === "function" && onClosed();
  };

  onFormChange = (key, value) => {
    const { onChange, data = {} } = this.props;
    const { addInfo = {} } = data;
    let tmp = { ...addInfo, [key]: value };
    onChange &&
      typeof onChange === "function" &&
      onChange({ addInfo: { ...tmp } }, key);
  };

  changeCode = (value) => {
    const { onCodeChange } = this.props;
    onCodeChange && typeof onCodeChange === "function" && onCodeChange(value);
  };

  handleAddGoods = (scanCode) => {
    const { onAddGoods } = this.props;
    if (!scanCode) {
      message.warning("请先扫码加流水码或手动添加！");
      return;
    }
    onAddGoods && typeof onAddGoods === "function" && onAddGoods();
  };

  handleDeleteGoods = (record, index) => {
    const { onDelete } = this.props;
    onDelete && typeof onDelete === "function" && onDelete(record, index);
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

  render() {
    const { data = {} } = this.props;
    const {
      addInfo = {},
      scanCode,
      replenishOrderList,
      scanCodeProductList,
      personList,
      drawerLoading,
    } = data;
    return (
      <Drawer
        title="发货单"
        visible
        width={1100}
        className="drawer-box"
        onClose={this.handleCancel}
        maskClosable={false}
      >
        <Spin spinning={drawerLoading}>
          <Form
            {...layout}
            ref={this.formRef}
            onFinish={this.onFinish}
            style={{ marginTop: "24px" }}
          >
            <Row>
              <Col span={8}>
                <Form.Item label="发货单号:">
                  {addInfo.sendOrder || ""}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="日期:">{addInfo.nowDate || ""}</Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="调出仓库:">
                  {addInfo.outStock || ""}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="调入仓库:">{addInfo.inStock || ""}</Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="调拨类型:">
                  {addInfo.allotType || ""}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="客户:">{addInfo.customer || ""}</Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item
                  label="快递单号:"
                  name="orderNo"
                  rules={[{ required: true, message: "请输入快递单号" }]}
                >
                  <Input
                    onChange={(e) =>
                      this.onFormChange("orderNo", e.target.value)
                    }
                    placeholder="请输入快递单号"
                    allowClear
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="发货人:"
                  name="person"
                  rules={[{ required: true, message: "请选择发货人" }]}
                >
                  <Select
                    placeholder="请选择"
                    options={personList}
                    onChange={(value) => this.onFormChange("person", value)}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="手机号:">{addInfo.mobile}</Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="简介:" name="desc">
                  <TextArea
                    rows={3}
                    placeholder="请输入简介"
                    onChange={(e) => this.onFormChange("desc", e.target.value)}
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
              scroll={{ y: 500 }}
              rowKey={(record, index) => index}
              dataSource={replenishOrderList}
              rowKey="productCode"
              pagination={false}
            >
              <Column
                title="补货单编码"
                dataIndex="replenishNumber"
                width={145}
              />
              <Column title="产品编码" dataIndex="productCode" width={120} />
              <Column title="产品名称" dataIndex="productName" width={150} />
              <Column title="规格" dataIndex="model" width={100} />
              <Column title="型号" dataIndex="regModel" width={80} />
              <Column title="单位" dataIndex="unit" width={70} />
              <Column title="生产厂家" dataIndex="productVendor" width={100} />
              <Column
                title="补货数量"
                dataIndex="replenishNum"
                width={90}
                fixed="right"
              />
              <Column
                title="已补数量"
                dataIndex="deliverNum"
                width={90}
                fixed="right"
              />
              <Column
                title="未补数量"
                dataIndex="waitNum"
                width={90}
                fixed="right"
              />
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
                value={scanCode}
                onChange={(e) => this.changeCode(e.target.value)}
                allowClear
              />
              <Button
                type="primary"
                style={{ position: "relative", left: "-3px" }}
                onClick={() => this.handleAddGoods(scanCode)}
              >
                添加商品
              </Button>
            </div>
            <Table
              bordered
              scroll={{ y: 400 }}
              dataSource={scanCodeProductList}
              rowKey="serialNo"
              pagination={false}
            >
              <Column
                title="序号"
                render={(value, record, index) => index + 1}
                width={80}
              />
              <Column title="流水号" dataIndex="serialNo" width={110} />
              <Column title="产品编码" dataIndex="productCode" width={125} />
              <Column title="产品名称" dataIndex="productName" width={180} />
              <Column title="规格" dataIndex="model" width={100} />
              <Column title="型号" dataIndex="regModel" width={80} />
              <Column title="单位" dataIndex="unit" width={80} />
              <Column title="单价" dataIndex="unit" width={80} />
              <Column title="生产厂家" dataIndex="productVendor" width={150} />
              <Column
                title="补货单编码"
                dataIndex="replenishNumber"
                width={120}
              />
              <Column
                title="操作"
                width={80}
                fixed="right"
                render={(value, record, index) => {
                  return (
                    <Space size="middle">
                      <a onClick={() => this.handleDeleteGoods(record, index)}>
                        删除
                      </a>
                    </Space>
                  );
                }}
              />
            </Table>
          </BasicDiv>
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

export default SubmitSendGoods;
