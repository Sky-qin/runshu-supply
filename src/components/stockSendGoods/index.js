import React from "react";
import styled from "styled-components";
import {
  Drawer,
  Button,
  Table,
  Form,
  Col,
  Row,
  Input,
  message,
  Space,
  Spin,
} from "antd";

const { Column } = Table;

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
  width: 1100px;
  border-top: 1px solid #ddd;
`;

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

let enterTime = null;

class StockSendGoods extends React.Component {
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
    const { basicInfo = {} } = data;
    let tmp = { ...basicInfo, [key]: value };
    onChange &&
      typeof onChange === "function" &&
      onChange({ basicInfo: { ...tmp } }, key);
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

  onPressEnter = () => {
    const { data = {} } = this.props;
    const { scanCode } = data;
    if (enterTime) {
      clearTimeout(enterTime);
    }
    enterTime = setTimeout(() => {
      clearTimeout(enterTime);
      this.handleAddGoods(scanCode);
    }, 100);
  };

  render() {
    const { data = {} } = this.props;
    const {
      basicInfo = {},
      scanCode,
      productList,
      scanCodeProductList,
      drawerLoading,
    } = data;
    return (
      <Drawer
        title="备货单"
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
                <Form.Item label="单号:">{basicInfo.orderNumber}</Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="申请人:">{basicInfo.userName}</Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="申请日期:">{basicInfo.createTime}</Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="调出仓库:">{basicInfo.outStock}</Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="调入仓库:">{basicInfo.inStock}</Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="客户:">{basicInfo.hospitalName}</Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="调拨类型:">{basicInfo.typeName}</Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="备货截止日期:">
                  {basicInfo.expectCompleteDate}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="备注:" name="remarks">
                  {basicInfo.remarks}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div>
            <WrapTitle>
              <span className="berfore-bar" />
              <span className="group-title">备货单</span>
            </WrapTitle>
            <Table
              bordered
              scroll={{ y: 500 }}
              rowKey={(record, index) => index}
              dataSource={productList}
              rowKey="productCode"
              pagination={false}
            >
              <Column title="产品编码" dataIndex="productCode" width={120} />
              <Column title="产品名称" dataIndex="productName" width={150} />
              <Column title="规格" dataIndex="regularModel" width={100} />
              <Column title="型号" dataIndex="model" width={80} />
              <Column title="单位" dataIndex="unitName" width={70} />
              <Column
                title="生产厂家"
                dataIndex="productVendorName"
                width={100}
              />
              <Column
                title="备货数量"
                dataIndex="prepareNumber"
                width={90}
                fixed="right"
              />
              <Column
                title="已备数量"
                dataIndex="prepareCompleteNumber"
                width={90}
                fixed="right"
              />
              <Column
                title="未备数量"
                dataIndex="unPrepareNumber"
                width={90}
                fixed="right"
              />
            </Table>
          </div>
          <BasicDiv>
            <WrapTitle>
              <span className="berfore-bar" />
              <span className="group-title">备货清单</span>
            </WrapTitle>
            <div style={{ padding: "8px" }}>
              流水号:
              <Input
                style={{ width: "650px", marginLeft: "12px" }}
                value={scanCode}
                onChange={(e) => this.changeCode(e.target.value)}
                onPressEnter={this.onPressEnter}
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
              <Column title="流水号" dataIndex="serialNo" width={100} />
              <Column title="产品编码" dataIndex="productCode" width={130} />
              <Column title="产品名称" dataIndex="productName" width={180} />
              <Column title="规格" dataIndex="regularModel" width={100} />
              <Column title="型号" dataIndex="model" width={80} />
              <Column title="单位" dataIndex="unitName" width={80} />
              <Column title="单价" dataIndex="productPrice" width={80} />
              <Column title="生产厂家" dataIndex="productVendor" width={150} />
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

export default StockSendGoods;
