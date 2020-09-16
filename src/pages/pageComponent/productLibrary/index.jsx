import React from "react";
import { connect } from "dva";
import { Table } from "antd";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";
import "./index.scss";

const { Column } = Table;

class ProductLibrary extends React.Component {
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
      type: "productLibraryModel/queryProductList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.productLibraryModel;
    dispatch({
      type: "productLibraryModel/save",
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
    const { pagination, data, loading } = this.props.productLibraryModel;
    const { current, size, total } = pagination;
    return (
      <ContentWrap loading={loading}>
        <OpreationBar total={total} />
        <Table
          bordered
          rowKey={(record, index) => index}
          dataSource={data}
          scroll={{ x: 1800 }}
          pagination={{
            position: ["bottomCenter"],
            current: current,
            total: total || 0,
            pageSize: size,
            onChange: this.changePagination,
            onShowSizeChange: this.changePagination,
          }}
        >
          <Column title="产品编号" dataIndex="productCode" width={130} />
          <Column title="JDE编码" dataIndex="jdeCode" width={120} />
          <Column title="JDE名称" dataIndex="jdeName" width={150} />
          <Column title="JDE规格" dataIndex="jdeModel" width={120} />
          <Column title="产品名称" dataIndex="productName" width={150} />
          <Column title="产品简称" dataIndex="productShortName" width={130} />
          <Column title="规格型号" dataIndex="model" width={125} />
          <Column title="单位" dataIndex="unitName" width={90} />
          <Column title="产品属性" dataIndex="productProperty" width={130} />
          <Column title="产品类别" dataIndex="productCategory" width={130} />
          <Column title="单价" dataIndex="productPrice" width={90} />
          <Column title="生产厂家" dataIndex="productVendorName" width={150} />
          <Column title="注册证号" dataIndex="registrationNo" width={135} />
          <Column
            title="生产许可证号"
            dataIndex="productLicenseNo"
            width={175}
          />
          <Column
            title="JDE供应商名称"
            dataIndex="jdeSupplierName"
            width={190}
          />
          <Column title="JDE进货单价" dataIndex="jdePrice" width={175} />
        </Table>
      </ContentWrap>
    );
  }
}

export default connect(({ productLibraryModel }) => ({
  productLibraryModel,
}))(ProductLibrary);
