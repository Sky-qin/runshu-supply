import React from "react";
import { connect } from "dva";
import { Table, Input, Button, Select, TreeSelect } from "antd";
import { ExportOutlined, SearchOutlined } from "@ant-design/icons";
import { Prefix } from "../../../utils/config";
import { OpreationBar, ContentBox } from "wrapd";
import "./index.scss";

const { Column } = Table;

class ProductLibrary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "productLibraryModel/queryCatetoryTree" });
    dispatch({ type: "productLibraryModel/productListVendor" });
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

  filterChange = (value, key, extend) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.productLibraryModel;

    let temp = {};
    if (key === "categoryCode") {
      temp = value
        ? {
            category: {
              categoryCode: value,
              level: extend.triggerNode.props.level,
            },
          }
        : { category: {} };
    }

    dispatch({
      type: "productLibraryModel/save",
      payload: {
        [key]: value,
        ...temp,
        pagination: {
          ...pagination,
          current: 1,
        },
      },
    });
    if (key === "keyword") return;
    this.getTableList();
  };

  render() {
    const {
      pagination,
      data,
      loading,
      keyword,
      categoryCode,
      productVendor,
      productCategoryList,
      productVendorList,
    } = this.props.productLibraryModel;
    const { current, size, total } = pagination;
    return (
      <ContentBox loading={loading}>
        <OpreationBar
          custom={
            <>
              <div
                style={{ width: 260, display: "inline-block", marginRight: 15 }}
              >
                <Input
                  style={{ width: 225 }}
                  placeholder="输入产品名称/编码"
                  value={keyword}
                  onChange={(e) => this.filterChange(e.target.value, "keyword")}
                  allowClear
                />
                <Button
                  style={{ position: "relative", left: "-3px", top: "1px" }}
                  onClick={this.getTableList}
                  icon={<SearchOutlined />}
                />
              </div>

              <TreeSelect
                filterTreeNode
                treeNodeFilterProp="label"
                placeholder="请选择分类"
                treeData={productCategoryList}
                value={categoryCode || null}
                style={{ width: 260, marginRight: 15 }}
                allowClear
                onChange={(value, label, extend) => {
                  this.filterChange(value, "categoryCode", extend);
                }}
              />
              <Select
                placeholder="请选择生产厂家"
                value={productVendor || null}
                showSearch
                optionFilterProp="label"
                options={productVendorList}
                allowClear
                style={{ width: 260, marginRight: 15 }}
                onChange={(value) => this.filterChange(value, "productVendor")}
              />
            </>
          }
          linkList={[
            {
              key: "export",
              label: "导出",
              icon: <ExportOutlined />,
              url: `${Prefix}/supply/product/exportIndustry`,
              params: { keyword },
            },
          ]}
          total={total}
          onClick={this.handleClick}
        />
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
          <Column
            title="序号"
            render={(value, record, index) => index + 1}
            width={80}
          />
          <Column title="产品名称" dataIndex="productName" width={160} />
          {/* <Column title="产品简称" dataIndex="productShortName" width={130} /> */}
          <Column title="产品编码" dataIndex="productCode" width={130} />
          <Column title="型号" dataIndex="model" width={125} />
          <Column title="规格" dataIndex="regularModel" width={125} />
          {/* <Column title="单价" dataIndex="productPrice" width={90} /> */}
          <Column title="产品类别" dataIndex="productCategory" width={130} />
          <Column title="单位" dataIndex="unitName" width={80} />
          <Column title="生产厂家" dataIndex="productVendorName" width={160} />
          <Column title="注册证号" dataIndex="registrationNo" width={135} />
          <Column
            title="生产许可证号"
            dataIndex="productLicenseNo"
            width={175}
          />

          {/* <Column title="JDE编码" dataIndex="jdeCode" width={120} />
          <Column title="JDE名称" dataIndex="jdeName" width={150} />
          <Column title="JDE规格" dataIndex="jdeModel" width={120} />

          <Column
            title="JDE供应商名称"
            dataIndex="jdeSupplierName"
            width={190}
          />
          <Column title="JDE进货单价" dataIndex="jdePrice" width={175} /> */}
        </Table>
      </ContentBox>
    );
  }
}

export default connect(({ productLibraryModel }) => ({
  productLibraryModel,
}))(ProductLibrary);
