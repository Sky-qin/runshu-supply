import React from "react";
import { connect } from "dva";
import styled from "styled-components";
import { Modal, Button, Table } from "antd";

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

  render() {
    const { title, data } = this.props;
    const { inventoryList, currentMsg, inventoryPagination } = data;
    return (
      <Modal
        title={title}
        visible
        style={{ minWidth: "1000px", maxWidth: "1100px" }}
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={false}
      >
        <BasicName>产品名称：{currentMsg.productName || ""}</BasicName>
        <BasicDiv>
          <div>产品编号：{currentMsg.productCode || ""}</div>
          <div>规格：{currentMsg.regularModel || ""}</div>
          <div>型号：{currentMsg.model || ""}</div>
          <div>单位：{currentMsg.unitName || ""}</div>
          <div>产品批号：{currentMsg.batchNo || ""}</div>
        </BasicDiv>
        <Table
          scroll={{ y: 400 }}
          dataSource={inventoryList}
          rowKey={(record, index) => index}
          // pagination={false}
          pagination={{
            position: ["bottomCenter"],
            current: inventoryPagination.current,
            total: inventoryPagination.total || 0,
            pageSize: inventoryPagination.size,
            onChange: this.changePagination,
            onShowSizeChange: this.changePagination,
          }}
        >
          <Column title="流水号" dataIndex="serialNo" lock="left" width={110} />
          <Column title="生产日期" dataIndex="productDate" width={130} />
          <Column
            title="保质期"
            dataIndex="period"
            width={130}
            render={(value) => `${value || 0}天`}
          />
          <Column title="生产厂家" dataIndex="vendorName" width={130} />
          <Column
            title="生产许可证号"
            dataIndex="productLicenseNo"
            width={130}
          />
          <Column title="注册证号" dataIndex="registrationNo" width={130} />
        </Table>
      </Modal>
    );
  }
}

export default connect(({ consumeModel }) => ({
  consumeModel,
}))(EditDialog);
