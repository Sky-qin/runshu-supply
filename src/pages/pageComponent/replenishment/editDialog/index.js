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
        // style={{ minWidth: "1000px", maxWidth: "1100px" }}
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={false}
      >
        <BasicDiv>
          <div>订单编号：{currentMsg.productCode || ""}</div>
          <div>医院：{currentMsg.model || ""}</div>
          <div>科室：{currentMsg.regularModel || ""}</div>
          <div>申请人：{currentMsg.unitName || ""}</div>
          <div>申请日期：{currentMsg.batchNo || ""}</div>
        </BasicDiv>
        <Table
          scroll={{ y: 400 }}
          dataSource={inventoryList}
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
          <Column
            title="序号"
            render={(value, record, index) => index + 1}
            width={110}
          />
          <Column title="产品编号" dataIndex="" width={110} />
          <Column title="产品名称" dataIndex="" width={130} />
          <Column title="规格型号" dataIndex="" width={130} />
          <Column title="常见型号" dataIndex="" width={130} />
          <Column title="产品批号" dataIndex="" width={130} />
          <Column title="单位" dataIndex="" width={130} />
          <Column title="数量" dataIndex="" width={130} />
          {/* 有疑问一批产品得生产日期和保质期一定相同嘛 */}
          <Column title="生产日期" dataIndex="" width={130} />
          <Column title="保质期" dataIndex="" width={130} />
          <Column title="有效期至" dataIndex="" width={130} />

          <Column title="生产厂家" dataIndex="" width={130} />
          <Column title="生产许可证号" dataIndex="" width={130} />
          <Column title="补货数" dataIndex="" width={130} />
        </Table>
      </Modal>
    );
  }
}

export default connect(({ consumeModel }) => ({
  consumeModel,
}))(EditDialog);
