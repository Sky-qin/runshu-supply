import React from "react";
import { connect } from "dva";
import styled from "styled-components";
import { Modal, Button, Table } from "antd";

const { Column } = Table;

const BasicDiv = styled.div`
  > div {
    display: inline-block;
    width: 280px;
    margin-right: 20px;
    line-height: 48px;
  }
`;

class EditDialog extends React.Component {
  departmentRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "consumeModel/save",
      payload: {
        showDetailDialog: false,
      },
    });
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

  render() {
    const { showDetailDialog, detailMsg } = this.props.consumeModel;
    return (
      <Modal
        title="消耗单详情"
        visible={showDetailDialog}
        style={{ minWidth: "1000px", maxWidth: "1100px" }}
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={() => this.renderFooter(detailMsg)}
      >
        <BasicDiv>
          <div>流水号：{detailMsg.consumeNumber || ""}</div>
          <div>医院：{detailMsg.hispitalName || ""}</div>
          <div>科室：{detailMsg.departmentName || ""}</div>
          <div>申请人：{detailMsg.operationName || ""}</div>
          <div>申请日期：{detailMsg.operationTime || ""}</div>
        </BasicDiv>
        <div style={{ overflowX: "scroll" }}>
          <Table
            style={{
              width: "1500px",
              maxWidth: "none",
              minHeight: "500px",
              overflowX: "scroll",
            }}
            dataSource={detailMsg.productList || []}
            pagination={false}
          >
            <Column title="产品分类" dataIndex="productCategory" width={110} />
            <Column title="流水号" dataIndex="serialNo" width={110} />
            <Column title="产品名称" dataIndex="productName" width={150} />
            <Column title="规格型号" dataIndex="regularModel" width={140} />
            <Column title="产品批号" dataIndex="batchNo" width={130} />
            <Column title="单位" dataIndex="unitName" width={80} />
            <Column
              title="数量"
              dataIndex="number"
              width={80}
              render={(value) => value || 1}
            />
            <Column title="生产日期" dataIndex="productDate" width={130} />
            <Column title="有效期" dataIndex="validPeriodDate" width={130} />
            <Column title="生产厂家" dataIndex="vendorName" width={130} />
            <Column title="注册证号" dataIndex="registrationNo" width={130} />
          </Table>
        </div>
      </Modal>
    );
  }
}

export default connect(({ consumeModel }) => ({
  consumeModel,
}))(EditDialog);
