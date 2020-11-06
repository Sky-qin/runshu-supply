import React from "react";
import { connect } from "dva";
import { Table, Select, Tabs } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import styled from "styled-components";

import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";

const { Column } = Table;
const { TabPane } = Tabs;

const WrapSpan = styled.span`
  color: red;
`;

class RecentWarnInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "recentWarnInfoModel/getAllStock",
      payload: { keyword: "" },
    });
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "recentWarnInfoModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.recentWarnInfoModel;
    dispatch({
      type: "recentWarnInfoModel/save",
      payload: {
        pagination: {
          ...pagination,
          current,
          size,
        },
      },
    });
    this.getTableList();
  };

  onChangeFilter = (value, key) => {
    const { dispatch } = this.props;
    dispatch({
      type: "recentWarnInfoModel/save",
      payload: {
        [key]: value,
      },
    });
    this.getTableList();
  };

  getStockList = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: "recentWarnInfoModel/getAllStock",
      payload: {
        keyword: value,
      },
    });
  };

  renderTableList = () => {
    const { pagination, data } = this.props.recentWarnInfoModel;
    const { current, size, total } = pagination;

    return (
      <Table
        bordered
        scroll={{ x: 1300 }}
        rowKey={(record, index) => index}
        dataSource={data}
        pagination={{
          position: ["bottomCenter"],
          current: current,
          total: total || 0,
          pageSize: size,
          onChange: this.changePagination,
          onShowSizeChange: this.changePagination,
        }}
      >
        <Column
          title="序号"
          width={80}
          render={(value, record, index) => index + 1}
        />
        <Column title="流水号" dataIndex="serialNo" width={90} />
        <Column title="产品名称" dataIndex="productName" width={160} />
        <Column title="规格" dataIndex="model" width={120} />
        <Column title="生产厂家" dataIndex="vendorName" width={160} />
        <Column title="仓库" dataIndex="stockName" width={160} />
        <Column title="生产日期" dataIndex="productDate" width={120} />
        <Column title="有效期" dataIndex="validPeriodDate" width={120} />
        <Column title="预警值" dataIndex="periodValue" width={90} />
        <Column
          title="剩余天数"
          dataIndex="surplusDays"
          width={140}
          fixed="right"
          render={(value) => {
            return <WrapSpan>{value}</WrapSpan>;
          }}
        />
      </Table>
    );
  };

  changeTab = (value) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.recentWarnInfoModel;

    dispatch({
      type: "recentWarnInfoModel/save",
      payload: {
        type: value,
        pagination: {
          ...pagination,
          current: 1,
          total: 0,
        },
      },
    });
    this.getTableList();
  };

  render() {
    const {
      pagination,
      loading,
      stockList,
      stockId,
    } = this.props.recentWarnInfoModel;
    const { total } = pagination;

    return (
      <ContentWrap loading={loading}>
        <OpreationBar
          custom={
            <>
              <Select
                showSearch
                allowClear={true}
                filterOption={false}
                value={stockId || null}
                onChange={(value) => this.onChangeFilter(value, "stockId")}
                onSearch={(value) => this.getStockList(value)}
                style={{ width: 260 }}
                options={stockList}
                placeholder="请选择库位"
              />
            </>
          }
          linkList={[
            {
              key: "export",
              label: "导出",
              icon: <ExportOutlined />,
              params: { stockId },
              url: "/userMessage/exportPeriod",
            },
          ]}
          total={total}
        />
        <Tabs defaultActiveKey="replenishList" onChange={this.changeTab}>
          <TabPane tab="预警产品" key="1">
            {this.renderTableList()}
          </TabPane>
          <TabPane tab="过期产品" key="2">
            {this.renderTableList()}
          </TabPane>
        </Tabs>
      </ContentWrap>
    );
  }
}

export default connect(({ recentWarnInfoModel }) => ({
  recentWarnInfoModel,
}))(RecentWarnInfo);
