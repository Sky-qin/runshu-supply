import React from "react";
import { connect } from "dva";
import styled from "styled-components";
import { Modal, Button, Table, Tabs } from "antd";

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

const BasicName = styled.div`
  padding-left: 20px;
`;

class EditDialog extends React.Component {
  departmentRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { onClosed } = this.props;
    onClosed && typeof onClosed === "function" && onClosed();
  };

  handleEdit = (msg, text, status) => {
    const { dispatch } = this.props;
    dispatch({
      type: "consumeModel/save",
      payload: {
        clickStatus: status,
        statusTitle: text,
        showStatusDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  renderFooter = (msg) => {
    const { orderStatus } = msg;
    let list = [];
    if (orderStatus === 0) {
      list.push();
      list = [
        <Button key="cancel" onClick={() => this.handleEdit(msg, "驳回", "2")}>
          驳回
        </Button>,
        <Button
          key="ok"
          type="primary"
          onClick={() => this.handleEdit(msg, "确定", "1")}
        >
          确定
        </Button>,
      ];
    }
    if (orderStatus === 4) {
      list = [
        <Button
          key="ok"
          type="primary"
          onClick={() => this.handleEdit(msg, "确认撤销", "5")}
        >
          确认撤销
        </Button>,
      ];
    }
    return list;
  };

  changePagination = (current, size) => {
    const { onChange } = this.props;
    onChange && typeof onChange === "function" && onChange(current, size);
  };

  changeTab = (value) => {
    console.log("value", value);
  };

  renderReplenishList = () => {
    const { data } = this.props;
    const { inventoryList, inventoryPagination } = data;
    return (
      <Table
        bordered
        scroll={{ y: 400 }}
        dataSource={inventoryList}
        rowKey="productCode"
        pagination={{
          hideOnSinglePage: true,
          position: ["bottomCenter"],
          current: inventoryPagination.current,
          total: inventoryPagination.total || 0,
          defaultPageSize: inventoryPagination.size,
          onChange: this.changePagination,
          showSizeChanger: false,
        }}
      >
        <Column
          title="序号"
          render={(value, record, index) => index + 1}
          width={80}
        />

        <Column title="产品编号" dataIndex="productCode" width={130} />
        <Column title="产品名称" dataIndex="productName" width={180} />
        <Column title="规格" dataIndex="model" width={120} />
        <Column title="型号" dataIndex="" width={100} />
        <Column title="单位" dataIndex="unitName" width={80} />
        <Column title="单价" dataIndex="" width={100} />
        <Column title="金额" dataIndex="" width={100} />
        <Column title="补货数量" dataIndex="" width={100} />
        <Column title="已补数量" dataIndex="" width={100} />
        <Column title="未补数量" dataIndex="" width={100} />
        <Column title="摘要" dataIndex="" width={180} />
      </Table>
    );
  };

  renderDeliveryList = () => {
    const { data } = this.props;
    const { inventoryList, inventoryPagination } = data;
    return (
      <Table
        bordered
        scroll={{ y: 400 }}
        dataSource={inventoryList}
        pagination={{
          hideOnSinglePage: true,
          position: ["bottomCenter"],
          current: inventoryPagination.current,
          total: inventoryPagination.total || 0,
          defaultPageSize: inventoryPagination.size,
          onChange: this.changePagination,
          showSizeChanger: false,
        }}
      >
        <Column title="物流单号" dataIndex="productCode" width={130} />
        <Column title="产品名称" dataIndex="productName" width={180} />
        <Column title="规格" dataIndex="model" width={120} />
        <Column title="型号" dataIndex="" width={100} />
        <Column title="单位" dataIndex="unitName" width={80} />
        <Column title="单价" dataIndex="" width={100} />
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
        style={{ minWidth: "1000px", maxWidth: "1100px" }}
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={false}
      >
        <BasicDiv>
          <div>订单编号：{currentMsg.productCode || ""}</div>
          <div>库位：{"SSSS" || ""}</div>
          <div>科室：{"SSSSS" || ""}</div>
          <div>申请人：{"SSSS" || ""}</div>
          <div>申请日期：{"SSSS" || ""}</div>
        </BasicDiv>
        <Tabs defaultActiveKey="replenishList" onChange={this.changeTab}>
          <TabPane tab="补货清单" key="replenishList">
            {this.renderReplenishList()}
          </TabPane>
          <TabPane tab="发货清单" key="deliveryList">
            {this.renderDeliveryList()}
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default connect(({ consumeModel }) => ({
  consumeModel,
}))(EditDialog);
