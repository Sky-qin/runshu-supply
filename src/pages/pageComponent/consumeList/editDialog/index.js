import React from "react";
import { connect } from "dva";
import { Modal, Table } from "antd";
import { ViewLyout } from "wrapd";

const { ViewLabelItem, ViewBox } = ViewLyout;
const { Column } = Table;

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
      <ViewLabelItem title="手术名称：" key="operationName">
        {detailMsg.operationName || ""}
      </ViewLabelItem>,
      <ViewLabelItem title="手术医生：" key="operationDoctor">
        {detailMsg.operationDoctor || ""}
      </ViewLabelItem>,
      <ViewLabelItem title="专家：" key="expert">
        {detailMsg.expert || ""}
      </ViewLabelItem>,
      <ViewLabelItem title="手术时间：" key="operationTime">
        {detailMsg.operationTime || ""}
      </ViewLabelItem>,
      <ViewLabelItem title="患者住院号：" key="patientHospitaliNumber">
        {detailMsg.patientHospitaliNumber || ""}
      </ViewLabelItem>,
      <ViewLabelItem title="患者姓名：" key="patientName">
        {detailMsg.patientName || ""}
      </ViewLabelItem>,
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
        <ViewBox count={4}>
          <ViewLabelItem title="流水号：">
            {detailMsg.consumeNumber || ""}
          </ViewLabelItem>

          <ViewLabelItem title="医院：">
            {detailMsg.hispitalName || ""}
          </ViewLabelItem>

          <ViewLabelItem title="科室：">
            {detailMsg.departmentName || ""}
          </ViewLabelItem>

          <ViewLabelItem title="提交人：">
            {detailMsg.userName || ""}
          </ViewLabelItem>

          <ViewLabelItem title="提交时间：">
            {detailMsg.operationTime || ""}
          </ViewLabelItem>

          <ViewLabelItem title="状态：">
            {detailMsg.orderStatusDesc || ""}
          </ViewLabelItem>

          <ViewLabelItem title="合计价格：">
            {detailMsg.price || ""}
          </ViewLabelItem>

          {showOperationInfo && this.renderOperationInfo()}
          <ViewLabelItem title="备注：">
            {detailMsg.remarkDesc || ""}
          </ViewLabelItem>
        </ViewBox>
        <div style={{ textAlign: "right" }}>
          <a
            onClick={() =>
              this.setState({ showOperationInfo: !showOperationInfo })
            }
          >
            {showOperationInfo ? "收起手术信息" : "查看手术信息"}
          </a>
        </div>
        <div style={{ overflowX: "scroll" }}>
          <Table
            rowKey="serialNo"
            style={{
              width: "1300px",
              maxWidth: "none",
              height: "500px",
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
