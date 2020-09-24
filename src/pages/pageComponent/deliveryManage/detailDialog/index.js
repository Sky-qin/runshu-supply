import React from "react";
import { connect } from "dva";
import styled from "styled-components";
import { Modal, Table, Space } from "antd";

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

  getDetail = (record) => {
    const { onChange } = this.props;
    onChange && typeof onChange === "function" && onChange(record);
  };

  render() {
    const { title, data } = this.props;
    const { productList, basicInfo } = data;
    return (
      <Modal
        title={title}
        visible
        style={{ minWidth: "1000px", maxWidth: "1100px" }}
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={false}
      >
        <BasicDiv>
          <div>发货单号：{basicInfo.sendOrder || ""}</div>
          <div>日期：{basicInfo.sendOrderTime || ""}</div>
          <div>调出仓库：{basicInfo.outStock || ""}</div>
          <div>调入仓库：{basicInfo.inStock || ""}</div>
          <div>调拨类型：{basicInfo.allotType || ""}</div>
          <div>快递单号：{basicInfo.expNo || ""}</div>
          <div>发货人：{basicInfo.sendOrderPerson || ""}</div>
          <div>手机号：{basicInfo.sendOrderPhone || ""}</div>
          <div>摘要：{basicInfo.orderDesc || ""}</div>
        </BasicDiv>
        <Table
          bordered
          scroll={{ y: 400 }}
          dataSource={productList}
          pagination={false}
          rowKey="serialNo"
        >
          <Column
            title="序号"
            render={(value, record, index) => index + 1}
            width={80}
          />
          <Column title="流水号" dataIndex="serialNo" width={110} />
          <Column title="产品编号" dataIndex="productCode" width={130} />
          <Column title="产品名称" dataIndex="productName" width={220} />
          <Column title="规格" dataIndex="model" width={130} />
          <Column title="型号" dataIndex="regModel" width={100} />
          <Column title="单位" dataIndex="unit" width={90} />
          <Column title="单价" dataIndex="productPrice" width={90} />
          <Column
            title="补货单号"
            dataIndex="replenishNumber"
            width={120}
            fixed="right"
            render={(value, record, index) => {
              return (
                <Space size="middle">
                  <a onClick={() => this.getDetail(record)}>{value}</a>
                </Space>
              );
            }}
          />
        </Table>
      </Modal>
    );
  }
}

export default connect(({ consumeModel }) => ({
  consumeModel,
}))(EditDialog);
