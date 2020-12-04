import React from "react";
import { connect } from "dva";
import styled from "styled-components";
import { Modal, Table } from "antd";
import { ViewLyout } from "wrapd";

const { ViewLabelItem, ViewBox } = ViewLyout;
const { Column } = Table;

const WrapTitle = styled.div`
  font-size: 18px;
  line-height: 30px;
  display: flex;
  padding: 10px 0px;
  .berfore-bar {
    height: 30px;
    width: 4px;
    background: #1890ff;
    margin-right: 4px;
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

  render() {
    const { data, groupTitle } = this.props;
    return (
      <Modal
        title="补货单详情"
        visible
        style={{ minWidth: "1000px", maxWidth: "1100px", height: "600px" }}
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={false}
      >
        <ViewBox>
          <ViewLabelItem title="单号：" key="orderNumber">
            {data.orderNumber || ""}
          </ViewLabelItem>
          <ViewLabelItem title="日期：" key="createTime">
            {data.createTime || ""}
          </ViewLabelItem>
          <ViewLabelItem title="调出仓库：" key="outStock">
            {data.outStock || ""}
          </ViewLabelItem>
          <ViewLabelItem title="调拨类型：" key="typeName">
            {data.typeName || ""}
          </ViewLabelItem>
          <ViewLabelItem title="备注：" key="remarks">
            {data.remarks || ""}
          </ViewLabelItem>
        </ViewBox>
        <WrapTitle>
          <span className="berfore-bar" />
          <span className="group-title">{groupTitle || "清单"}</span>
        </WrapTitle>
        <Table
          bordered
          scroll={{ y: 400 }}
          dataSource={(data && data.productList) || []}
          rowKey="serialNo"
          pagination={false}
        >
          <Column
            title="序号"
            render={(value, record, index) => index + 1}
            width={80}
          />
          <Column title="流水号" dataIndex="serialNo" width={100} />
          <Column title="产品编号" dataIndex="productCode" width={130} />
          <Column title="产品名称" dataIndex="productName" width={180} />
          <Column title="调入仓库" dataIndex="inStock" width={130} />
          <Column title="型号" dataIndex="model" width={120} />
          <Column title="规格" dataIndex="regModel" width={100} />
          <Column title="单位" dataIndex="unit" width={80} />
          <Column title="生产厂家" dataIndex="productVendor" width={100} />
        </Table>
      </Modal>
    );
  }
}

export default connect(({ consumeModel }) => ({
  consumeModel,
}))(DetailDialog);
