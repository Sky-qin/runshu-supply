import React from "react";
import { connect } from "dva";
import { Table, Input } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";

const { Column } = Table;
const { Search } = Input;

class OneProductCode extends React.Component {
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
      type: "oneProductCodeModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.oneProductCodeModel;
    dispatch({
      type: "oneProductCodeModel/save",
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
    const { pagination } = this.props.oneProductCodeModel;
    dispatch({
      type: "oneProductCodeModel/save",
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

  render() {
    const { pagination, data, loading } = this.props.oneProductCodeModel;
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
            </>
          }
          total={total}
        />
        <Table
          bordered
          scroll={{ x: 1850 }}
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
            render={(value, record, index) => index + 1}
            width={65}
          />
          <Column title="流水号" dataIndex="serialNo" width={120} />
          <Column title="产品名称" dataIndex="productName" width={150} />
          <Column title="产品简称" dataIndex="productShortName" width={120} />
          <Column title="产品编码" dataIndex="productCode" width={120} />
          <Column title="JDE编码" dataIndex="jdeCode" width={120} />
          <Column title="辽宁阳光采购编码" dataIndex="" width={150} />
          <Column title="吉林阳光采购编码" dataIndex="" width={150} />
          <Column title="规格" dataIndex="model" width={120} />
          <Column title="型号" dataIndex="regularModel" width={90} />
          <Column title="单位" dataIndex="unitName" width={80} />
          <Column title="生产厂家" dataIndex="vendorName" width={130} />
          <Column title="注册证号" dataIndex="registrationNo" width={120} />
          <Column
            title="生产许可证号"
            dataIndex="productLicenseNo"
            width={140}
          />
          <Column
            title="JDE供应商名称"
            dataIndex="jdeSupplierName"
            width={150}
          />
          <Column title="JDE进货单价" dataIndex="jdePrice" width={130} />
        </Table>
      </ContentWrap>
    );
  }
}

export default connect(({ oneProductCodeModel }) => ({
  oneProductCodeModel,
}))(OneProductCode);
