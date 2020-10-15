import React from "react";
import { connect } from "dva";
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
    const { data, replenishOrderList, groupTitle } = this.props;
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
          <div>单号：XXXXXXXXXXXXXXXX</div>
          <div>日期：XXXXXXXXXXXXXXXX</div>
          <div>调出仓库：XXXXXXXXXXXXXXXX</div>
          <div>调入仓库：XXXXXXXXXXXXXXXX</div>
          <div>调拨类型：XXXXXXXXXXXXXXXX</div>
          <div>客户：XXXXXXXXXXXXXXXX</div>
          <div>描述：XXXXXXXXXXXXXXXX</div>
        </BasicDiv>
        <WrapTitle>
          <span className="berfore-bar" />
          <span className="group-title">{groupTitle || "清单"}</span>
        </WrapTitle>
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
          <Column title="流水号" dataIndex="流水号" width={100} />
          <Column title="产品编号" dataIndex="productCode" width={130} />
          <Column title="产品名称" dataIndex="productName" width={180} />
          <Column title="规格" dataIndex="model" width={120} />
          <Column title="型号" dataIndex="regModel" width={100} />
          <Column title="单位" dataIndex="unit" width={80} />
          <Column title="单价" dataIndex="" width={100} />
          <Column title="生产厂家" dataIndex="" width={100} />
          <Column title="源单编号" dataIndex="deliverNum" width={100} />
        </Table>
      </Modal>
    );
  }
}

export default connect(({ consumeModel }) => ({
  consumeModel,
}))(DetailDialog);
