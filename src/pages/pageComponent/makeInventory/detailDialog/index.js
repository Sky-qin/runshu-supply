import React from "react";
import styled from "styled-components";
import { Modal, Table, Tabs, Popover } from "antd";
import { ViewLyout } from "wrapd";
const { ViewLabelItem, ViewBox } = ViewLyout;
const { Column } = Table;
const { TabPane } = Tabs;

const NumBerDiv = styled.div`
  display: flex;
  text-align: center;
  font-size: 16px;
  margin-left: 10px;
  margin-bottom: 10px;
  > div {
    .num-div {
      font-weight: 600;
    }
    padding-right: 50px;
  }
  .blue-color {
    color: #1890ff;
  }
  .wran-color {
    color: red;
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

  renderInventoryList = (list) => {
    return (
      <Table
        bordered
        scroll={{ y: 400 }}
        dataSource={list}
        rowKey="productCode"
        pagination={false}
      >
        <Column
          title="序号"
          render={(value, record, index) => index + 1}
          width={65}
        />
        {/* <Column title="产品编号" dataIndex="productCode" width={130} /> */}
        <Column title="产品名称" dataIndex="productName" width={180} />
        <Column title="规格" dataIndex="model" width={120} />
        <Column title="生产厂家" dataIndex="vendorName" width={120} />
        {/* <Column title="型号" dataIndex="regModel" width={100} /> */}
        {/* <Column title="单位" dataIndex="unitName" width={65} /> */}
        <Column title="库存数量" dataIndex="inventoryNumber" width={100} />
        <Column title="盘点数量" dataIndex="checkNumber" width={100} />
        <Column title="盘点状态" dataIndex="checkStatusLabel" width={100} />
      </Table>
    );
  };
  renderInventoryDetails = (list) => {
    return (
      <Table
        bordered
        scroll={{ y: 400 }}
        dataSource={list || []}
        rowKey="serialNo"
        pagination={false}
      >
        <Column
          title="序号"
          render={(value, record, index) => index + 1}
          width={65}
        />
        <Column title="流水号" dataIndex="serialNo" width={100} />
        <Column title="产品名称" dataIndex="productName" width={180} />
        <Column title="规格" dataIndex="model" width={120} />
        <Column title="生产厂家" dataIndex="vendorName" width={120} />
        <Column title="生产批号" dataIndex="batchNo" width={120} />
        <Column title="有效期" dataIndex="validPeriodDate" width={120} />
        <Column
          fixed="right"
          title="盘点方式"
          dataIndex="isScanProduct"
          width={90}
          render={(value) => (value ? "扫码输入" : "手动输入")}
        />
        <Column
          fixed="right"
          title="附件照片"
          dataIndex="imageUrl"
          width={100}
          render={(value) => {
            return value ? (
              <Popover
                content={<img alt="图片" src={value} />}
                title="图片"
                trigger="click"
              >
                <a>查看照片</a>
              </Popover>
            ) : (
              "无"
            );
          }}
        />
      </Table>
    );
  };

  renderSpotCheckDetails = (list) => {
    return (
      <Table
        bordered
        scroll={{ y: 400 }}
        dataSource={[]}
        rowKey="serialNo"
        pagination={false}
      >
        <Column
          title="序号"
          render={(value, record, index) => index + 1}
          width={65}
        />
        <Column title="流水号" dataIndex="serialNo" width={100} />
        <Column title="产品名称" dataIndex="productName" width={180} />
        <Column title="规格" dataIndex="model" width={120} />
        <Column title="生产厂家" dataIndex="vendorName" width={120} />
        <Column title="生产批号" dataIndex="batchNo" width={120} />
        <Column title="有效期" dataIndex="validPeriodDate" width={120} />
        <Column
          fixed="right"
          title="附件照片"
          dataIndex="imageUrl"
          width={100}
          render={(value) => {
            return value ? (
              <Popover
                content={<img alt="图片" src={value} />}
                title="图片"
                trigger="click"
              >
                <a>查看照片</a>
              </Popover>
            ) : (
              "无"
            );
          }}
        />
      </Table>
    );
  };

  renderStatus = (basicInfo) => {
    const { checkStatus, surplusNumber, lossNumber } = basicInfo;
    if (checkStatus === 0) {
      return <div className="blue-color">无盈亏</div>;
    }
    if (checkStatus === 3) {
      return <div className="wran-color">有异常</div>;
    }
    if (checkStatus === 1) {
      return (
        <div className="wran-color">
          <div className="num-div">{surplusNumber || 0}</div>
          <div>盘盈</div>
        </div>
      );
    }
    if (checkStatus === 2) {
      return (
        <div className="wran-color">
          <div className="num-div">{`-${lossNumber}` || 0}</div>
          <div>盘亏</div>
        </div>
      );
    }
  };

  render() {
    const { data } = this.props;
    const { basicInfo, detailList, detailProductList } = data;
    return (
      <Modal
        title="盘点单详情"
        visible
        style={{ minWidth: "1000px", maxWidth: "1100px", height: "600px" }}
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={false}
      >
        <ViewBox>
          <ViewLabelItem title="单号：" key="checkNo">
            {basicInfo.checkNo || ""}
          </ViewLabelItem>
          <ViewLabelItem title="盘点仓库：" key="stockName">
            {basicInfo.stockName || ""}
          </ViewLabelItem>
          <ViewLabelItem title="盘点人：" key="creatorName">
            {basicInfo.creatorName || ""}
          </ViewLabelItem>
          <ViewLabelItem title="创建时间：" key="createTime">
            {basicInfo.createTime || ""}
          </ViewLabelItem>
          <ViewLabelItem title="库存数量：" key="inventoryNumber">
            {basicInfo.inventoryNumber || ""}
          </ViewLabelItem>
          <ViewLabelItem title="盘点数量：" key="checkNumber">
            {basicInfo.checkNumber || ""}
          </ViewLabelItem>
          <ViewLabelItem title="盘点状态：" key="checkStatusName">
            {basicInfo.checkStatusName || ""}
          </ViewLabelItem>
          {basicInfo.position && (
            <ViewLabelItem>
              <i
                className={`iconfont iconlocation`}
                style={{ color: "#1890ff", marginRight: "5px" }}
              />
              {basicInfo.position}
            </ViewLabelItem>
          )}
        </ViewBox>
        <NumBerDiv>
          <div>
            <div className="num-div blue-color">{basicInfo.checkNumber}</div>
            <div>盘点数量</div>
          </div>
          <div>
            <div className="num-div">{basicInfo.inventoryNumber}</div>
            <div>库存数量</div>
          </div>
          {this.renderStatus(basicInfo)}
        </NumBerDiv>
        <Tabs defaultActiveKey="replenishList" onChange={this.changeTab}>
          <TabPane tab="盘点清单" key="replenishList">
            {this.renderInventoryList(detailList)}
          </TabPane>
          <TabPane tab="盘点明细" key="deliveryList">
            {this.renderInventoryDetails(detailProductList)}
          </TabPane>
          <TabPane tab="盘点检查" key="spotCheck">
            {this.renderSpotCheckDetails(detailProductList)}
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default DetailDialog;
