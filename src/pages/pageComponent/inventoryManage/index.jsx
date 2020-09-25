import React from "react";
import { connect } from "dva";
import { Table, Input } from "antd";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";

const { Column } = Table;
const { Search } = Input;
class InventoryManage extends React.Component {
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
      type: "inventoryManafeModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.inventoryManafeModel;
    dispatch({
      type: "inventoryManafeModel/save",
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
    const { pagination } = this.props.inventoryManafeModel;
    dispatch({
      type: "inventoryManafeModel/save",
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
    const { pagination, data, loading } = this.props.inventoryManafeModel;
    const { current, size, total } = pagination;
    return (
      <ContentWrap loading={loading}>
        <OpreationBar
          custom={
            <>
              <Search
                placeholder="输入库位名称"
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
          <Column title="库位编码" dataIndex="stockNo" />
          <Column title="库位名称" dataIndex="name" />
          <Column title="地址" dataIndex="address" />
          <Column title="电话" dataIndex="phone" />
        </Table>
      </ContentWrap>
    );
  }
}

export default connect(({ inventoryManafeModel }) => ({
  inventoryManafeModel,
}))(InventoryManage);
