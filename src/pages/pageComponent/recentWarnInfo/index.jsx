import React from "react";
import { connect } from "dva";
import { Table, Input } from "antd";
import styled from "styled-components";

import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";

const { Column } = Table;
const { Search } = Input;
const WrapSpan = styled.span`
  color: red;
`;

class RecentWarnInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
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

  filterChange = (value, key) => {
    const { dispatch } = this.props;
    dispatch({
      type: "recentWarnInfoModel/save",
      payload: {
        [key]: value,
      },
    });
    this.getTableList();
  };

  render() {
    const { pagination, data, loading } = this.props.recentWarnInfoModel;
    const { current, size, total } = pagination;
    return (
      <ContentWrap loading={loading}>
        <OpreationBar
          // custom={
          //   <>
          //     <Search
          //       placeholder="输入产品名称/编码"
          //       onSearch={(value) => this.filterChange(value, "keyWord")}
          //       style={{ width: 260 }}
          //     />
          //   </>
          // }
          total={total}
        />
        <Table
          bordered
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
          <Column title="流水号" dataIndex="serialNo" />
          <Column title="产品名称" dataIndex="productName" />
          <Column title="规格" dataIndex="model" />
          <Column title="生产厂家" dataIndex="vendorName" />
          <Column title="仓库" dataIndex="stockName" />
          <Column title="生产日期" dataIndex="productDate" />
          <Column title="有效期" dataIndex="validPeriodDate" />
          <Column title="预警值" dataIndex="periodValue" />
          <Column
            title="剩余天数"
            dataIndex="surplusDays"
            render={(value) => {
              return <WrapSpan>{value}</WrapSpan>;
            }}
          />
        </Table>
      </ContentWrap>
    );
  }
}

export default connect(({ recentWarnInfoModel }) => ({
  recentWarnInfoModel,
}))(RecentWarnInfo);
