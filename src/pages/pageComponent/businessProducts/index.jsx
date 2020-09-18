import React from "react";
import { connect } from "dva";
import { Table, Input, Select } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";

const { Column } = Table;
const { Search } = Input;

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
    this.getTableList();
  };

  handleClickOpr = (key) => {
    const { dispatch } = this.props;
    // if (key === "export") {
    //   dispatch({ type: "businessProductsModel/exportList" });
    // }
  };

  render() {
    const {
      pagination,
      data,
      loading,
      keyword,
      isOnsale,
    } = this.props.businessProductsModel;
    const { current, size, total } = pagination;
    return (
      <ContentWrap loading={loading}>
        <OpreationBar
          custom={
            <>
              <Search
                placeholder="输入产品名称/编码"
                onSearch={(value) => this.filterChange(value, "keyword")}
                style={{ width: 260 }}
              />
              <Select
                placeholder="请选择在售情况"
                options={[
                  { value: 1, label: "是" },
                  { value: 0, label: "否" },
                ]}
                allowClear
                style={{ width: 260, marginLeft: 15 }}
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
              url: "/supply/product/onsale/export",
            },
          ]}
          total={total}
          onClick={this.handleClickOpr}
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
            title="是否在售"
            dataIndex="onsale"
            width={125}
            render={(value, record, index) => {
              return value ? "是" : "否";
            }}
          />
          <Column title="产品名称" dataIndex="productName" width={180} />
          <Column title="产品简称" dataIndex="productShortName" width={125} />
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
          <Column title="规格" dataIndex="model" width={120} />
          <Column title="型号" dataIndex="regularModel" width={100} />
          <Column title="单位" dataIndex="unitName" width={100} />
          <Column title="产品属性" dataIndex="productProperty" width={125} />
          <Column title="产品类型" dataIndex="productCategory" width={125} />
          <Column title="单价" dataIndex="productPrice" width={120} />
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
          <Column title="JDE进货单价" dataIndex="jdePrice" width={150} />
        </Table>
      </ContentWrap>
    );
  }
}

export default connect(({ businessProductsModel }) => ({
  businessProductsModel,
}))(BusinessProducts);
