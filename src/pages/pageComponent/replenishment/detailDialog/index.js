import React from "react";
import { connect } from "dva";
import { Modal, Button, Table, Tabs, Space, Popover, Timeline } from "antd";
import { ViewLyout } from "wrapd";

const { ViewLabelItem, ViewBox } = ViewLyout;

const { Column } = Table;
const { TabPane } = Tabs;

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

  // changeTab = (value) => {
  //   const { onGetTableList } = this.props;
  //   onGetTableList &&
  //     typeof onGetTableList === "function" &&
  //     onGetTableList(value);
  // };

  renderReplenishList = () => {
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
        <Column title="产品编号" dataIndex="productCode" width={130} />
        <Column title="产品名称" dataIndex="productName" width={180} />
        <Column title="型号" dataIndex="model" width={120} />
        <Column title="规格" dataIndex="regModel" width={100} />
        <Column title="单位" dataIndex="unit" width={80} />
        <Column title="补货数量" dataIndex="replenishNum" width={100} />
        <Column title="已补数量" dataIndex="deliverNum" width={100} />
        <Column title="未补数量" dataIndex="waitNum" width={100} />
      </Table>
    );
  };

  renderContent = (record) => {
    const { nodeList } = record;
    const { deliveryList } = nodeList;
    return (
      <div style={{ width: 500 }}>
        <div>快递公司：{record.expCompanyName || ""}</div>
        <div style={{ marginBottom: "20px" }}>
          快递单号：{record.expNo || ""}
        </div>
        <Timeline>
          {(deliveryList || []).map((item, index) => {
            return (
              <Timeline.Item>
                <div>{item.nodeLabel}</div>
                {(item.nodeList || []).map((node, index) => {
                  return <div key={index}>{node.detail || ""}</div>;
                })}
              </Timeline.Item>
            );
          })}
        </Timeline>
      </div>
    );
  };

  renderDeliveryList = () => {
    const { data } = this.props;
    const { deliverInfoList } = data;
    return (
      <Table
        bordered
        scroll={{ y: 400 }}
        dataSource={deliverInfoList}
        rowKey="orderNo"
        pagination={false}
      >
        <Column title="发货单号" dataIndex="orderNo" width={130} />
        <Column title="流水号" dataIndex="serialNo" width={100} />
        <Column title="产品名称" dataIndex="productName" width={180} />
        <Column title="型号" dataIndex="model" width={120} />
        <Column title="规格" dataIndex="regModel" width={100} />
        <Column title="单位" dataIndex="unit" width={80} />
        <Column
          title="物流详情"
          width={90}
          render={(value, record, index) => {
            const { orderNo } = record;
            return (
              <Space>
                {orderNo && (
                  <Popover
                    placement="left"
                    title="物流信息"
                    content={() => this.renderContent(record)}
                    trigger="click"
                  >
                    <Button type="link">查看</Button>
                  </Popover>
                )}
              </Space>
            );
          }}
        />
      </Table>
    );
  };

  render() {
    const { data } = this.props;
    const { currentMsg, addInfo } = data;
    return (
      <Modal
        title="补货单详情"
        visible
        style={{ minWidth: "1000px", maxWidth: "1100px", height: "600px" }}
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={false}
      >
        <ViewBox count={4}>
          <ViewLabelItem title="补货单号：" key="replenishNumber">
            {currentMsg.replenishNumber || ""}
          </ViewLabelItem>
          <ViewLabelItem title="医院：" key="hospitalName">
            {currentMsg.hospitalName || ""}
          </ViewLabelItem>
          <ViewLabelItem title="科室：" key="departmentName">
            {currentMsg.departmentName || ""}
          </ViewLabelItem>
          <ViewLabelItem title="申请人：" key="userName">
            {currentMsg.userName || ""}
          </ViewLabelItem>
          <ViewLabelItem title="申请日期：" key="createTime">
            {currentMsg.createTime || ""}
          </ViewLabelItem>
          <ViewLabelItem title="发货数量：" key="sendProductNumber">
            {addInfo.sendProductNumber || 0}
          </ViewLabelItem>
          <ViewLabelItem title="备注：" key="remarks">
            {currentMsg.remarks || ""}
          </ViewLabelItem>
        </ViewBox>
        <Tabs defaultActiveKey="replenishList">
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
