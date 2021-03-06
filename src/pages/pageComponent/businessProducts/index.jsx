import React from "react";
import { connect } from "dva";
import { Table, Input, Select, Button } from "antd";
import { ExportOutlined, SearchOutlined } from "@ant-design/icons";
import { OpreationBar, ContentBox } from "wrapd";
import { Prefix } from "../../../utils/config";

const { Column } = Table;

class BusinessProducts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "businessProductsModel/getPricePermission" });
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

  filterChange = (value, key) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.businessProductsModel;
    dispatch({
      type: "businessProductsModel/save",
      payload: {
        [key]: value,
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
      isOnsale,
      pricePermission,
    } = this.props.businessProductsModel;
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
              <Select
                placeholder="请选择库存情况"
                options={[
                  { value: 1, label: "有库存" },
                  { value: 0, label: "无库存" },
                ]}
                allowClear
                style={{ width: 260, marginRight: 15 }}
                onChange={(value) => this.filterChange(value, "isOnsale")}
              />
            </>
          }
          linkList={[
            {
              key: "export",
              label: "导出",
              icon: <ExportOutlined />,
              params: { keyword, isOnsale },
              url: `${Prefix}/supply/product/onsale/export`,
            },
          ]}
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
          scroll={{ x: 2150 }}
        >
          <Column
            title="序号"
            render={(value, rocord, index) => index + 1}
            width={80}
          />
          <Column
            title="库存情况"
            dataIndex="onsale"
            width={125}
            render={(value, record, index) => {
              return value ? (
                <span style={{ color: "#87d068" }}>有库存</span>
              ) : (
                <span style={{ color: "#f73537" }}>无库存</span>
              );
            }}
          />
          <Column title="产品名称" dataIndex="productName" width={180} />
          {/* <Column title="产品简称" dataIndex="productShortName" width={125} /> */}
          <Column title="产品编码" dataIndex="productCode" width={125} />
          <Column title="JDE编码" dataIndex="jdeCode" width={120} />
          <Column
            title="辽宁阳光采购编码"
            dataIndex="sunshineCodeLN"
            width={150}
          />
          <Column
            title="吉林阳光采购编码"
            dataIndex="sunshineCodeJL"
            width={150}
          />
          <Column title="型号" dataIndex="model" width={120} />
          <Column title="规格" dataIndex="regularModel" width={100} />
          <Column title="单位" dataIndex="unitName" width={100} />
          <Column title="产品类型" dataIndex="productCategory" width={125} />
          {/* <Column title="单价" dataIndex="productPrice" width={120} /> */}
          <Column title="生产厂家" dataIndex="productVendorName" width={180} />
          <Column title="注册证号" dataIndex="registrationNo" width={135} />
          <Column
            title="生产许可证号"
            dataIndex="productLicenseNo"
            width={175}
          />
          <Column
            title="JDE供应商名称"
            dataIndex="jdeSupplierName"
            width={175}
          />
          {pricePermission && (
            <Column title="JDE进货单价" dataIndex="jdePrice" width={150} />
          )}
        </Table>
      </ContentBox>
    );
  }
}

export default connect(({ businessProductsModel }) => ({
  businessProductsModel,
}))(BusinessProducts);
