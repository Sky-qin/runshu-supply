import React from "react";
import { connect } from "dva";
import { Table } from "antd";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";

const { Column } = Table;

class BusinessProducts extends React.Component {
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
      type: "businessProductsModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.businessProductsModel;
    dispatch({
      type: "businessProductsModel/save",
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

  render() {
    const { pagination, data, loading } = this.props.businessProductsModel;
    const { current, size, total } = pagination;
    return (
      <ContentWrap loading={loading}>
        <OpreationBar
          // buttonList
          linkList={[{ total }]}
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
          <Column title="产品编号" dataIndex="productCode" width={120} />
          <Column title="JDE编码" dataIndex="jdeCode" width={120} />
          <Column title="商品名称" dataIndex="productName" width={200} />
          <Column title="规格型号" dataIndex="model" width={120} />
          <Column title="常见型号" dataIndex="regularModel" width={120} />
          <Column title="生产厂家" dataIndex="productVendorName" width={200} />
        </Table>
      </ContentWrap>
    );
  }
}

export default connect(({ businessProductsModel }) => ({
  businessProductsModel,
}))(BusinessProducts);
