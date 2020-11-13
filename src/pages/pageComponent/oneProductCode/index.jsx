import React from "react";
import { connect } from "dva";
import { Table, Input, Select, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";

const { Column } = Table;

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
    if (key === "keyword") return;
    this.getTableList();
  };

  render() {
    const {
      pagination,
      data,
      loading,
      keyword,
      isConsumed,
    } = this.props.oneProductCodeModel;
    const { current, size, total } = pagination;
    return (
      <ContentWrap loading={loading}>
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
                placeholder="请选择是否消耗"
                value={isConsumed}
                options={[
                  { value: true, label: "是" },
                  { value: false, label: "否" },
                ]}
                allowClear
                style={{ width: 260, marginRight: 15 }}
                onChange={(value) => this.filterChange(value, "isConsumed")}
              />
            </>
          }
          total={total}
        />
        <Table
          bordered
          scroll={{ x: 2000 }}
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
          {/* <Column
            title="序号"
            render={(value, record, index) => index + 1}
            width={80}
          /> */}
          <Column title="流水号" dataIndex="serialNo" width={120} />
          <Column title="产品名称" dataIndex="productName" width={150} />
          <Column title="产品编码" dataIndex="productCode" width={120} />
          <Column
            title="消耗状态"
            dataIndex="isConsumed"
            width={120}
            render={(value, record, index) => {
              return value ? "是" : "否";
            }}
          />
          <Column title="消耗日期" dataIndex="consumeDate" width={130} />
          <Column title="生产日期" dataIndex="productDate" width={130} />
          <Column title="有效期" dataIndex="validPeriodDate" width={130} />
          <Column title="型号" dataIndex="model" width={120} />
          <Column title="规格" dataIndex="regularModel" width={120} />
          <Column title="单位" dataIndex="unitName" width={80} />
          <Column title="生产批号" dataIndex="batchNo" width={130} />
          <Column title="生产厂家" dataIndex="vendorName" width={130} />
          <Column title="注册证号" dataIndex="registrationNo" width={120} />
          <Column
            title="生产许可证号"
            dataIndex="productLicenseNo"
            width={140}
          />
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
