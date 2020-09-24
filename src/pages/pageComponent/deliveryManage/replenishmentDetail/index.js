import React from "react";
import { Drawer, Table } from "antd";

const { Column } = Table;

class SubmitSendGoods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { onClosed } = this.props;
    onClosed && typeof onClosed === "function" && onClosed();
  };

  render() {
    const { data } = this.props;
    return (
      <Drawer
        title="发货单详情"
        visible
        width={900}
        onClose={this.handleCancel}
        maskClosable={false}
      >
        <Table
          bordered
          scroll={{ y: 500 }}
          dataSource={data}
          rowKey="replenishNumber"
          pagination={false}
        >
          <Column title="补货单编码" dataIndex="replenishNumber" width={145} />
          <Column title="产品编码" dataIndex="productCode" width={120} />
          <Column title="产品名称" dataIndex="productName" width={150} />
          <Column title="规格" dataIndex="model" width={100} />
          <Column title="型号" dataIndex="regModel" width={80} />
          <Column title="单位" dataIndex="unit" width={70} />
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
      </Drawer>
    );
  }
}

export default SubmitSendGoods;
