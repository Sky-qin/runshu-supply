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
  Spin,
} from "antd";
import scanSuccess from "../../assets/scanSuccess.mp3";

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
  width: 1000px;
  border-top: 1px solid #ddd;
`;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

let enterTime = null;

class AddCheckNum extends React.Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { onClosed } = this.props;
    onClosed && typeof onClosed === "function" && onClosed();
  };

  changeCode = (value) => {
    const { onCodeChange } = this.props;
    onCodeChange && typeof onCodeChange === "function" && onCodeChange(value);
  };

  handleAddGoods = (scanCode) => {
    const { onAddGoods } = this.props;
    let audio = document.getElementsByClassName("audio")[0];

    if (!scanCode) {
      message.warning("请先扫码加流水码或手动添加！");
      return;
    }
    onAddGoods && typeof onAddGoods === "function" && onAddGoods(audio);
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
    const { data = {}, title } = this.props;
    const {
      scanCode,
      inventoryCheck,
      productList,
      statisticList,
      drawerLoading,
      stockMsg = {},
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
          <audio
            style={{ display: "none" }}
            className="audio"
            src={scanSuccess}
          />

          <Form {...layout} ref={this.formRef} onFinish={this.onFinish}>
            <Row>
              <Col span={6}>
                <Form.Item label="盘点仓库:">{stockMsg.label || ""}</Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item label="库存数量:">
                  {inventoryCheck.inventoryNumber || 0}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="盘点数量:">
                  {inventoryCheck.checkNumber || 0}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="盘盈数量:">
                  {inventoryCheck.surplusNumber || 0}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="盘亏数量:">
                  {inventoryCheck.lossNumber || 0}
                </Form.Item>
              </Col>
            </Row>
            <Row></Row>
          </Form>

          <div>
            <WrapTitle>
              <span className="berfore-bar" />
              <span className="group-title">盘点汇总</span>
            </WrapTitle>
            <Table
              bordered
              scroll={{ y: 500 }}
              rowKey={(record, index) => index}
              dataSource={statisticList}
              rowKey="productCode"
              pagination={false}
            >
              <Column
                title="序号"
                render={(value, record, index) => index + 1}
                width={65}
              />
              {/* <Column title="产品编码" dataIndex="productCode" width={120} /> */}
              <Column title="产品名称" dataIndex="productName" width={165} />
              <Column title="规格" dataIndex="model" width={100} />
              {/* <Column title="型号" dataIndex="regModel" width={80} /> */}
              {/* <Column title="单位" dataIndex="unitName" width={70} /> */}
              {/* <Column title="单价" dataIndex="productPrice" width={70} /> */}
              <Column title="库存数量" dataIndex="inventoryNumber" width={90} />
              <Column title="盘点数量" dataIndex="checkNumber" width={90} />
              <Column
                title="盈亏情况"
                dataIndex="checkStatusLabel"
                width={90}
              />
            </Table>
          </div>
          <BasicDiv>
            <WrapTitle>
              <span className="berfore-bar" />
              <span className="group-title">盘点清单</span>
            </WrapTitle>
            <div style={{ padding: "8px" }}>
              流水号:
              <Input
                style={{ width: "650px", marginLeft: "12px" }}
                value={scanCode}
                onChange={(e) => this.changeCode(e.target.value)}
                onPressEnter={this.onPressEnter}
                placeholder="请用扫码枪扫码或手动输入流水码"
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
              {/* <Column title="产品编码" dataIndex="productCode" width={125} /> */}
              <Column title="产品名称" dataIndex="productName" width={180} />
              <Column title="规格" dataIndex="model" width={100} />
              {/* <Column title="型号" dataIndex="regModel" width={80} /> */}
              {/* <Column title="单位" dataIndex="unitName" width={80} /> */}
              {/* <Column title="单价" dataIndex="productPrice" width={80} /> */}
              <Column title="生产厂家" dataIndex="vendorName" width={100} />
              <Column title="生产批号" dataIndex="batchNo" width={100} />
              <Column title="有效期" dataIndex="validPeriodDate" width={100} />
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

export default AddCheckNum;
