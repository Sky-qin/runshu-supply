import React from "react";
import { connect } from "dva";
import { Table, Input, Button, Select } from "antd";
import { SearchOutlined, ExportOutlined } from "@ant-design/icons";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";

const { Column } = Table;
class InventoryManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: "inventoryManageModel/getStockTypeList",
    });
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "inventoryManageModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.inventoryManageModel;
    dispatch({
      type: "inventoryManageModel/save",
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
    const { pagination } = this.props.inventoryManageModel;
    dispatch({
      type: "inventoryManageModel/save",
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
      stockTypeList,
      keyword,
      type,
    } = this.props.inventoryManageModel;
    const { current, size, total } = pagination;
    return (
      <ContentWrap loading={loading}>
        <OpreationBar
          custom={
            <>
              <div style={{ width: 260, display: "inline-block" }}>
                <Input
                  style={{ width: 225 }}
                  placeholder="输入库位名称"
                  value={keyword}
                  onChange={(e) =>
                    this.onChangeFilter(e.target.value, "keyword")
                  }
                  allowClear
                />
                <Button
                  style={{ position: "relative", left: "-3px", top: "1px" }}
                  onClick={this.getTableList}
                  icon={<SearchOutlined />}
                />
              </div>
              <Select
                placeholder="请选择库位类别"
                value={type}
                options={stockTypeList}
                allowClear
                style={{ width: 260, marginLeft: 15 }}
                onChange={(value) => this.onChangeFilter(value, "type")}
              />
            </>
          }
          linkList={[
            {
              key: "export",
              label: "导出",
              icon: <ExportOutlined />,
              params: { keyword },
              url: "/supply/stock/export",
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
          <Column title="库位编码" dataIndex="stockNo" />
          <Column title="库位名称" dataIndex="name" />
          <Column title="库位类别" dataIndex="typeName" />
          <Column title="地址" dataIndex="address" />
          <Column title="电话" dataIndex="phone" />
        </Table>
      </ContentWrap>
    );
  }
}

export default connect(({ inventoryManageModel }) => ({
  inventoryManageModel,
}))(InventoryManage);
