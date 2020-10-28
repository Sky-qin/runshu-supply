import React from "react";
import { connect } from "dva";
import { Table, Input, Button } from "antd";
import { SearchOutlined, ExportOutlined } from "@ant-design/icons";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";

const { Column } = Table;
class CustomerManage extends React.Component {
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
      type: "customerManageModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.customerManageModel;
    dispatch({
      type: "customerManageModel/save",
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
    const { pagination } = this.props.customerManageModel;
    dispatch({
      type: "customerManageModel/save",
      payload: {
        [key]: value,
        pagination: {
          ...pagination,
          current: 1,
        },
      },
    });
  };

  render() {
    const {
      pagination,
      data,
      loading,
      supplierName,
    } = this.props.customerManageModel;
    const { current, size, total } = pagination;
    return (
      <ContentWrap loading={loading}>
        <OpreationBar
          custom={
            <>
              <div style={{ width: 260, display: "inline-block" }}>
                <Input
                  style={{ width: 225 }}
                  placeholder="输入供货公司名称"
                  value={supplierName}
                  onChange={(e) =>
                    this.onChangeFilter(e.target.value, "supplierName")
                  }
                  onPressEnter={this.getTableList}
                  allowClear
                />
                <Button
                  style={{ position: "relative", left: "-3px", top: "1px" }}
                  onClick={this.getTableList}
                  icon={<SearchOutlined />}
                />
              </div>
            </>
          }
          linkList={[
            {
              key: "export",
              label: "导出",
              icon: <ExportOutlined />,
              params: { supplierName },
              url: "/supply/customer/export",
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
        >
          <Column
            title="序号"
            width={80}
            render={(value, record, index) => index + 1}
          />
          <Column title="客户编码" dataIndex="code" />
          <Column title="客户关系" dataIndex="name" />
          <Column title="供货公司" dataIndex="supplierName" />
          <Column title="代理公司" dataIndex="agencyCompany" />
          <Column title="客户 " dataIndex="hospitalName" />
        </Table>
      </ContentWrap>
    );
  }
}

export default connect(({ customerManageModel }) => ({
  customerManageModel,
}))(CustomerManage);
