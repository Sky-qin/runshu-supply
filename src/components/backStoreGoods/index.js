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

let enterTime = null;

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

class SendGoods extends React.Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { onClosed } = this.props;
    onClosed && typeof onClosed === "function" && onClosed();
  };

  handleGetStock = (value) => {
    const { onGetStockList } = this.props;
    onGetStockList &&
      typeof onGetStockList === "function" &&
      onGetStockList(value);
  };

  onFormChange = (key, value, obj) => {
    const { onChange, data = {} } = this.props;
    const { addInfo = {} } = data;
    let tmp = {};
    if (key === "outStockId") {
      tmp = {
        ...addInfo,
        outStockId: (obj && obj.value) || null,
        outStockName: (obj && obj.label) || null,
      };
      onChange &&
        typeof onChange === "function" &&
        onChange({ productList: [] });
    }
    if (key === "inStockId") {
      tmp = {
        ...addInfo,
        inStockId: (obj && obj.value) || null,
        inStockName: (obj && obj.label) || null,
      };
    }
    if (key === "remarks") {
      tmp = { ...addInfo, [key]: value };
    }

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
    const { data = {}, title, groupTitle } = this.props;
    const {
      addInfo = {},
      scanCode,
      personalStockList,
      companyStockList,
      productList,
      drawerLoading,
    } = data;
    return (
      <Drawer
        title={title || "详情"}
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
            initialValues={{
              inStockId: addInfo.inStockId,
            }}
          >
            <Row>
              <Col span={8}>
                <Form.Item
                  label="调出仓库:"
                  name="outStockId"
                  rules={[{ required: true, message: "请选择调出仓库" }]}
                >
                  <Select
                    showSearch
                    placeholder="请选择"
                    options={personalStockList}
                    value={addInfo.outStockId}
                    onChange={(value, obj) =>
                      this.onFormChange("outStockId", value, obj)
                    }
                    onSearch={this.handleGetStock}
                    filterOption={false}
                    showArrow={false}
                    dropdownMatchSelectWidth={false}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="调入仓库:"
                  name="inStockId"
                  rules={[{ required: true, message: "请选择调入仓库" }]}
                >
                  <Select
                    showSearch
                    placeholder="请选择"
                    value={addInfo.inStockId}
                    options={companyStockList}
                    onChange={(value, obj) =>
                      this.onFormChange("inStockId", value, obj)
                    }
                    onSearch={this.handleGetStock}
                    filterOption={false}
                    showArrow={false}
                    dropdownMatchSelectWidth={false}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="调拨类型:">{addInfo.typeName}</Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="备注:" name="remarks">
                  <TextArea
                    rows={3}
                    placeholder="请输入备注"
                    onChange={(e) =>
                      this.onFormChange("remarks", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <BasicDiv>
            <WrapTitle>
              <span className="berfore-bar" />
              <span className="group-title">{groupTitle || "清单"}</span>
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
              dataSource={productList}
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

export default SendGoods;
