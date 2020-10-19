import React from "react";
import styled from "styled-components";
import { Modal, Table } from "antd";

const { Column } = Table;

const BasicDiv = styled.div`
  padding-left: 20px;
  > div {
    display: inline-block;
    width: 280px;
    margin-right: 20px;
    line-height: 48px;
  }
`;

class DetailDialog extends React.Component {
  departmentRef = React.createRef();

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
    const { basicInfo, detailList } = data;
    return (
      <Modal
        title="盘点单详情"
        visible
        style={{ minWidth: "1000px", maxWidth: "1100px", height: "600px" }}
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={false}
      >
        <BasicDiv>
          <div>单号：{basicInfo.checkNo}</div>
          <div>盘点仓库：{basicInfo.stockName}</div>
          <div>盘点人：{basicInfo.creatorName}</div>
          <div>创建时间：{basicInfo.createTime}</div>
          <div>库存数量：{basicInfo.inventoryNumber}</div>
          <div>盘点数量：{basicInfo.checkNumber}</div>
          <div>盘点状态：{basicInfo.checkStatusName}</div>
        </BasicDiv>
        <Table
          bordered
          scroll={{ y: 400 }}
          dataSource={detailList}
          rowKey="productCode"
          pagination={false}
        >
          <Column
            title="序号"
            render={(value, record, index) => index + 1}
            width={65}
          />
          <Column title="产品编号" dataIndex="productCode" width={130} />
          <Column title="产品名称" dataIndex="productName" width={180} />
          <Column title="规格" dataIndex="model" width={120} />
          <Column title="型号" dataIndex="regModel" width={100} />
          <Column title="单位" dataIndex="unitName" width={65} />
          <Column title="单价" dataIndex="productPrice" width={100} />
          <Column title="库存数量" dataIndex="inventoryNumber" width={100} />
          <Column title="盘点数量" dataIndex="checkNumber" width={100} />
          <Column title="盈亏情况" dataIndex="number" width={100} />
        </Table>
      </Modal>
    );
  }
}

export default DetailDialog;
