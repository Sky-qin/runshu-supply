import React from "react";
import styled from "styled-components";
import { Modal, Table, Tabs } from "antd";

const { Column } = Table;
const { TabPane } = Tabs;

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
    const { replenishOrderList } = data;
    return (
      <Table
        bordered
        scroll={{ y: 400 }}
        dataSource={replenishOrderList}
        rowKey="productCode"
        pagination={false}
      >
        <Column
          title="序号"
          render={(value, record, index) => index + 1}
          width={80}
        />
        <Column title="流水号" dataIndex="serialNo" width={130} />
        <Column title="产品编号" dataIndex="productCode" width={130} />
        <Column title="产品名称" dataIndex="productName" width={180} />
        <Column title="规格" dataIndex="model" width={120} />
        <Column title="型号" dataIndex="regModel" width={100} />
        <Column title="单位" dataIndex="unit" width={80} />
        <Column title="单价" dataIndex="" width={100} />
        <Column title="是否返库" dataIndex=" " width={100} />
      </Table>
    );
  };

  renderRetrunList = () => {
    const { data } = this.props;
    const { deliverInfoList } = data;
    return (
      <Table
        bordered
        rowKey={(record, index) => index}
        scroll={{ y: 400 }}
        dataSource={deliverInfoList}
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
        style={{ minWidth: "1000px", maxWidth: "1100px", height: "600px" }}
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={false}
      >
        <BasicDiv>
          <div>单号：XXXXXXXX</div>
          <div>创建人：XXXXXXXX</div>
          <div>创建日期：XXXXXXXX</div>
          <div>备货截止日期：XXXXXXXX</div>
          <div>调出仓库：XXXXXXXX</div>
          <div>调入仓库：XXXXXXXX</div>
          <div>调拨类型：XXXXXXXX</div>
          <div>客户：XXXXXXXX</div>
          <div>描述：XXXXXXXX</div>
        </BasicDiv>
        <Tabs defaultActiveKey="replenishList" onChange={this.changeTab}>
          <TabPane tab="备货清单" key="replenishList">
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
