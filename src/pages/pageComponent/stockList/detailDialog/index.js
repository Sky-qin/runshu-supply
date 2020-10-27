import React from "react";
import styled from "styled-components";
import { Modal, Table, Tabs } from "antd";

const { Column } = Table;
const { TabPane } = Tabs;

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

const BasicDiv = styled.div`
  padding-left: 20px;
  > div {
    display: inline-block;
    width: 280px;
    margin-right: 20px;
    line-height: 48px;
  }
`;

class EditDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { onClosed } = this.props;
    onClosed && typeof onClosed === "function" && onClosed();
  };

  changeTab = (value) => {
    const { onGetTableList } = this.props;
    onGetTableList &&
      typeof onGetTableList === "function" &&
      onGetTableList(value);
  };

  renderStockList = () => {
    const { data } = this.props;
    const { productList, serialnoList } = data;
    return (
      <div>
        <WrapTitle>
          <span className="berfore-bar" />
          <span className="group-title">备货单</span>
        </WrapTitle>
        <Table
          bordered
          scroll={{ y: 400 }}
          dataSource={productList}
          rowKey="productCode"
          pagination={false}
        >
          <Column
            title="序号"
            render={(value, record, index) => index + 1}
            width={80}
          />
          <Column title="产品编号" dataIndex="productCode" width={130} />
          <Column title="产品名称" dataIndex="productName" width={180} />
          <Column title="规格" dataIndex="model" width={120} />
          <Column title="型号" dataIndex="regModel" width={100} />
          <Column title="单位" dataIndex="unitName" width={80} />
          <Column title="单价" dataIndex="productPrice" width={100} />
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
        <WrapTitle>
          <span className="berfore-bar" />
          <span className="group-title">备货清单</span>
        </WrapTitle>
        <Table
          bordered
          scroll={{ y: 400 }}
          dataSource={serialnoList}
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
        </Table>
      </div>
    );
  };

  renderRetrunList = () => {
    const { data } = this.props;
    const { backStockList } = data;
    return (
      <Table
        bordered
        rowKey={(record, index) => index}
        scroll={{ y: 400 }}
        dataSource={backStockList || []}
        rowKey="orderNo"
        pagination={false}
      >
        <Column title="序号" render={(value, record, index) => index + 1} />
        <Column title="流水号" dataIndex="serialNo" width={130} />
        <Column title="产品编号" dataIndex="productCode" width={130} />
        <Column title="产品名称" dataIndex="productName" width={180} />
        <Column title="规格" dataIndex="model" width={120} />
        <Column title="型号" dataIndex="regModel" width={100} />
        <Column title="单位" dataIndex="unit" width={80} />
        <Column title="单价" dataIndex="unit" width={80} />
      </Table>
    );
  };

  render() {
    const { data } = this.props;
    const { currentMsg } = data;
    return (
      <Modal
        title="补货单详情"
        visible
        style={{
          minWidth: "1000px",
          maxWidth: "1100px",
          maxHeight: "750px",
        }}
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={false}
      >
        <BasicDiv>
          <div>单号：{currentMsg.orderNumber || ""}</div>
          <div>创建人：{currentMsg.userName || ""}</div>
          <div>创建日期：{currentMsg.createTime}</div>
          <div>备货截止日期：{currentMsg.expectCompleteDate}</div>
          <div>调出仓库：{currentMsg.outStock}</div>
          <div>调入仓库：{currentMsg.inStock}</div>
          <div>调拨类型：{currentMsg.inStock}</div>
          <div>客户：{currentMsg.hospitalName}</div>
          <div>备注：{currentMsg.remark}</div>
        </BasicDiv>
        <Tabs defaultActiveKey="replenishList" onChange={this.changeTab}>
          <TabPane tab="备货单" key="replenishList">
            {this.renderStockList()}
          </TabPane>
          <TabPane tab="备货返库清单" key="deliveryList">
            {this.renderRetrunList()}
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default EditDialog;
