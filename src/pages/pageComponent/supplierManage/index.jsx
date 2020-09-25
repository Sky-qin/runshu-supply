import React from "react";
import { connect } from "dva";
import { Table, Input } from "antd";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";

const { Column } = Table;
const { Search } = Input;
class SupplierManage extends React.Component {
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
      type: "supplierManageModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.supplierManageModel;
    dispatch({
      type: "supplierManageModel/save",
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
    const { pagination } = this.props.supplierManageModel;
    dispatch({
      type: "supplierManageModel/save",
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
    const { pagination, data, loading } = this.props.supplierManageModel;
    const { current, size, total } = pagination;
    return (
      <ContentWrap loading={loading}>
        <OpreationBar
          custom={
            <>
              <Search
                placeholder="输入供应商名称"
                onSearch={(value) => this.onChangeFilter(value, "keyword")}
                style={{ width: 260 }}
              />
            </>
          }
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
          <Column title="供应商编码" dataIndex="code" />
          <Column title="供应商名称" dataIndex="name" />
          <Column title="简码" dataIndex="shortCode" />
          <Column title="助记码" dataIndex="helpCode" />
          <Column title="联系人" dataIndex="contact" />
          <Column title="电话" dataIndex="phone" />
          <Column title="地址" dataIndex="address" />
        </Table>
      </ContentWrap>
    );
  }
}

export default connect(({ supplierManageModel }) => ({
  supplierManageModel,
}))(SupplierManage);
