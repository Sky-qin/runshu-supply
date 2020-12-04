import React from "react";
import { connect } from "dva";
import { Modal, Table, Space } from "antd";
import * as dd from "dingtalk-jsapi";
import { ViewLyout } from "wrapd";

const { ViewLabelItem, ViewBox } = ViewLyout;

const { Column } = Table;

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

  handleDownload = () => {
    dd.biz.util.downloadFile({
      url: "http://218.24.35.107/mhk/test.xlsx", //要下载的文件的url
      name: "test02.xlsx", //定义下载文件名字
      onProgress: function (msg) {
        // 文件下载进度回调
        console.log("下载中", msg);
      },
      onSuccess: function (result) {
        /*
            true
          */
        dd.biz.util.openLocalFile({
          url: "http://218.24.35.107/mhk/test.xlsx", //本地文件的url，指的是调用DingTalkPC.biz.util.downloadFile接口下载时填入的url，配合DingTalkPC.biz.util.downloadFile使用
          onSuccess: function (result) {
            /*
                true
              */
          },
          onFail: function () {
            alert("打开失败了!");
          },
        });
      },
      onFail: function () {
        console.log("下载失败");
      },
    });
  };

  render() {
    const { title, data } = this.props;
    const { productList, basicInfo } = data;
    return (
      <Modal
        title={title}
        visible
        style={{ minWidth: "1100px", maxWidth: "1100px" }}
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={false}
      >
        <ViewBox>
          <ViewLabelItem title="发货单号：" key="sendOrder">
            {basicInfo.sendOrder || ""}
          </ViewLabelItem>
          <ViewLabelItem title="日期：" key="sendOrderTime">
            {basicInfo.sendOrderTime || ""}
          </ViewLabelItem>
          <ViewLabelItem title="调出仓库：" key="outStock">
            {basicInfo.outStock || ""}
          </ViewLabelItem>
          <ViewLabelItem title="调入仓库：" key="inStock">
            {basicInfo.inStock || ""}
          </ViewLabelItem>
          <ViewLabelItem title="调拨类型：" key="allotType">
            {basicInfo.allotType || ""}
          </ViewLabelItem>
          <ViewLabelItem title="快递单号：" key="expNo">
            {basicInfo.expNo || ""}
          </ViewLabelItem>
          <ViewLabelItem title="发货人：" key="sendOrderPerson">
            {basicInfo.sendOrderPerson || ""}
          </ViewLabelItem>
          <ViewLabelItem title="手机号：" key="sendOrderPhone">
            {basicInfo.sendOrderPhone || ""}
          </ViewLabelItem>
          <ViewLabelItem title="发货数量：" key="productList">
            {productList.length || 0}
          </ViewLabelItem>
          <ViewLabelItem title="备注：" key="orderDesc">
            {basicInfo.orderDesc || ""}
          </ViewLabelItem>
        </ViewBox>
        {/* <Button onClick={this.handleDownload}>下载打印</Button> */}
        <Table
          bordered
          scroll={{ x: 1000, y: 500 }}
          dataSource={productList}
          pagination={false}
          rowKey={(record, index) => index}
        >
          <Column
            title="序号"
            render={(value, record, index) => index + 1}
            width={80}
          />
          <Column title="流水号" dataIndex="serialNo" width={110} />
          <Column title="产品编号" dataIndex="productCode" width={120} />
          <Column title="产品名称" dataIndex="productName" width={220} />
          <Column title="型号" dataIndex="model" width={130} />
          <Column title="规格" dataIndex="regModel" width={90} />
          <Column title="单位" dataIndex="unit" width={90} />
          {/* <Column title="单价" dataIndex="productPrice" width={90} /> */}
          <Column
            title="补货单号"
            dataIndex="replenishNumber"
            width={140}
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
