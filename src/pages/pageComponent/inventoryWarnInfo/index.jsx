import React from "react";
import { connect } from "dva";
import { Table } from "antd";
import styled from "styled-components";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";

const { Column } = Table;
const WrapSpan = styled.span`
  color: red;
`;

class InventoryWarnInfo extends React.Component {
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
      type: "inventoryWarnInfoModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.inventoryWarnInfoModel;
    dispatch({
      type: "inventoryWarnInfoModel/save",
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
      type: "inventoryWarnInfoModel/save",
      payload: {
        [key]: value,
      },
    });
    this.getTableList();
  };

  render() {
    const { pagination, data, loading } = this.props.inventoryWarnInfoModel;
    const { current, size, total } = pagination;
    return (
      <ContentWrap loading={loading}>
        <OpreationBar total={total} />
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
          <Column title="产品编码" dataIndex="productCode" />
          <Column title="产品名称" dataIndex="productName" />
          <Column title="库位" dataIndex="stockName" />
          <Column title="规格" dataIndex="model" />
          <Column title="生产厂家" dataIndex="vendorName" />
          <Column title="预警值" dataIndex="stockValue" />
          <Column
            title="库存数量"
            width={120}
            dataIndex="stock"
            render={(value) => {
              return <WrapSpan>{value}</WrapSpan>;
            }}
          />
        </Table>
      </ContentWrap>
    );
  }
}

export default connect(({ inventoryWarnInfoModel }) => ({
  inventoryWarnInfoModel,
}))(InventoryWarnInfo);
