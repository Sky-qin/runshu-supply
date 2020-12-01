import React from "react";
import { connect } from "dva";
import styled from "styled-components";
import { Modal, Table } from "antd";

const { Column } = Table;

const BasicDiv = styled.div`
  position: relative;
  > div {
    display: inline-block;
    width: 210px;
    margin-right: 20px;
    line-height: 48px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  > a {
    position: absolute;
    right: 30px;
    bottom: 10px;
  }
`;

class EditDialog extends React.Component {
  departmentRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      showOperationInfo: false,
    };
  }

  handleCancel = () => {
    const { dispatch } = this.props;
    this.setState({ showOperationInfo: false });
    dispatch({
      type: "consumeModel/save",
      payload: {
        showDetailDialog: false,
        dialogBtnLoading: false,
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

  renderOperationInfo = () => {
    const { detailMsg } = this.props.consumeModel;
    return [
      <div key="operationName">手术名称：{detailMsg.operationName || ""}</div>,
      <div key="operationDoctor">
        手术医生：{detailMsg.operationDoctor || ""}
      </div>,
      <div key="operationTime">手术时间：{detailMsg.operationTime || ""}</div>,
      <div key="patientHospitaliNumber">
        患者住院号：{detailMsg.patientHospitaliNumber || ""}
      </div>,
      <div key="patientName">患者姓名：{detailMsg.patientName || ""}</div>,
    ];
  };

  render() {
    const { showDetailDialog, detailMsg } = this.props.consumeModel;
    const { showOperationInfo } = this.state;
    return (
      <Modal
        title="消耗单详情"
        visible={showDetailDialog}
        style={{ minWidth: "1000px", maxWidth: "1100px" }}
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={false}
      >
        <BasicDiv>
          <div>流水号：{detailMsg.consumeNumber || ""}</div>
          <div>医院：{detailMsg.hispitalName || ""}</div>
          <div>科室：{detailMsg.departmentName || ""}</div>
          <div>提交人：{detailMsg.userName || ""}</div>
          <div>提交时间：{detailMsg.operationTime || ""}</div>
          <div>状态：{detailMsg.orderStatusDesc || ""}</div>
          <div>合计价格：{detailMsg.price || ""}</div>
          {showOperationInfo && this.renderOperationInfo()}
          <a
            onClick={() =>
              this.setState({ showOperationInfo: !showOperationInfo })
            }
          >
            {showOperationInfo ? "收起手术信息" : "查看手术信息"}
          </a>
        </BasicDiv>
        <div style={{ overflowX: "scroll" }}>
          <Table
            rowKey="serialNo"
            style={{
              width: "1300px",
              maxWidth: "none",
              minHeight: "500px",
            }}
            bordered
            dataSource={detailMsg.pcproductList || []}
            pagination={false}
          >
            <Column title="流水号" dataIndex="serialNo" width={110} />
            <Column title="产品名称" dataIndex="productName" width={150} />
            <Column title="规格" dataIndex="model" width={120} />
            <Column title="型号" dataIndex="regularModel" width={120} />
            <Column title="产品批号" dataIndex="batchNo" width={130} />
            <Column title="单位" dataIndex="unitName" width={80} />
            <Column title="销售价格" dataIndex="productPrice" width={80} />
            <Column
              title="数量"
              dataIndex="number"
              width={80}
              render={(value) => value || 1}
            />
            <Column title="生产日期" dataIndex="productDate" width={130} />
            <Column title="有效期" dataIndex="validPeriodDate" width={130} />
            <Column
              title="生产厂家"
              dataIndex="productVendorName"
              width={150}
            />
            <Column title="注册证号" dataIndex="registrationNo" width={130} />
            <Column
              fixed="right"
              title="价格情况"
              dataIndex="isPriceUnusual"
              width={120}
              render={(value) => {
                return value ? (
                  <span style={{ color: "red" }}>未设置价格</span>
                ) : (
                  <span style={{ color: "green" }}>正常</span>
                );
              }}
            />
          </Table>
        </div>
      </Modal>
    );
  }
}

export default connect(({ consumeModel }) => ({
  consumeModel,
}))(EditDialog);
