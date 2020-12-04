import React from "react";
import styled from "styled-components";
import { Modal, Table, Tabs } from "antd";
import { ViewLyout } from "wrapd";

const { ViewLabelItem, ViewBox } = ViewLyout;

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

class EditDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { onClosed } = this.props;
    onClosed && typeof onClosed === "function" && onClosed();
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
          <Column title="型号" dataIndex="model" width={120} />
          <Column title="规格" dataIndex="regModel" width={100} />
          <Column title="单位" dataIndex="unitName" width={80} />
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
          <Column
            title="价格情况"
            fixed="right"
            dataIndex="isExistUnusualProduct"
            width={90}
            render={(value) => {
              return value ? (
                <span style={{ color: "red" }}>未设置价格</span>
              ) : (
                <span style={{ color: "green" }}>正常</span>
              );
            }}
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
          {/* <Column title="单价" dataIndex="productPrice" width={80} /> */}
          <Column title="生产厂家" dataIndex="productVendorName" width={150} />
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
        scroll={{ y: 400 }}
        dataSource={backStockList || []}
        rowKey="serialNo"
        pagination={false}
      >
        <Column title="序号" render={(value, record, index) => index + 1} />
        <Column title="流水号" dataIndex="serialNo" width={130} />
        <Column title="产品编号" dataIndex="productCode" width={130} />
        <Column title="产品名称" dataIndex="productName" />
        <Column title="型号" dataIndex="model" width={120} />
        <Column title="规格" dataIndex="regularModel" width={120} />
        <Column title="单位" dataIndex="unitName" width={80} />
      </Table>
    );
  };

  render() {
    const { data } = this.props;
    const { currentMsg, basicInfo } = data;
    return (
      <Modal
        title="备货单详情"
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
        <ViewBox count={4}>
          <ViewLabelItem title="单号：" key="orderNumber">
            {currentMsg.orderNumber || ""}
          </ViewLabelItem>
          <ViewLabelItem title="创建人：" key="userName">
            {currentMsg.userName || ""}
          </ViewLabelItem>
          <ViewLabelItem title="创建日期：" key="createTime">
            {currentMsg.createTime}
          </ViewLabelItem>
          <ViewLabelItem title="手术日期：" key="expectCompleteDate">
            {currentMsg.expectCompleteDate}
          </ViewLabelItem>
          <ViewLabelItem title="调出仓库：" key="outStock">
            {currentMsg.outStock}
          </ViewLabelItem>
          <ViewLabelItem title="调入仓库：" key="inStock">
            {currentMsg.inStock}
          </ViewLabelItem>
          <ViewLabelItem title="调拨类型：" key="typeName">
            {currentMsg.typeName}
          </ViewLabelItem>
          <ViewLabelItem title="客户：" key="hospitalName">
            {currentMsg.hospitalName}
          </ViewLabelItem>
          <ViewLabelItem title="手术台数：" key="operaNumber">
            {basicInfo.operaNumber}
          </ViewLabelItem>
          <ViewLabelItem title="备注：" key="remarks">
            {basicInfo.remarks}
          </ViewLabelItem>
        </ViewBox>
        <Tabs defaultActiveKey="replenishList">
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
