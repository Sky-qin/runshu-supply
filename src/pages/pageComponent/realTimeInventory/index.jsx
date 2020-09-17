import React from "react";
import { connect } from "dva";
import { Space, Table, InputNumber, Select, Input } from "antd";
import EditDialog from "./editDialog";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";
import "./index.scss";

const { Column } = Table;
const { Search } = Input;

class RealTimeInventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "realInventoryModel/storageList" });
    dispatch({ type: "realInventoryModel/queryProductCategory" });

    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "realInventoryModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.realInventoryModel;
    dispatch({
      type: "realInventoryModel/save",
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
    const { dispatch, pagination } = this.props;
    dispatch({
      type: "realInventoryModel/save",
      payload: {
        [key]: value,
        pagination: {
          ...pagination,
          current: 1,
        },
      },
    });
    if (key === "validPeriod") return;
    this.getTableList();
  };

  handleShowDetail = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "realInventoryModel/productStock",
      payload: {
        productItemId: msg.productItemId,
        batchNo: msg.batchNo,
      },
    });
  };

  render() {
    const { dispatch } = this.props;
    const {
      showDetailDialog,
      productInventoryList,
      currentMsg,
      pagination,
      data,
      loading,
      productCategoryList,
    } = this.props.realInventoryModel;
    const { current, size, total } = pagination;
    return (
      <ContentWrap loading={loading}>
        <OpreationBar
          custom={
            <>
              <Search
                placeholder="输入产品名称/编码"
                onSearch={(value) => this.onChangeFilter(value, "keyword")}
                style={{ width: 260 }}
              />
              <InputNumber
                placeholder="请输入有效期"
                style={{ width: 260, marginLeft: 15 }}
                onChange={(value) => this.onChangeFilter(value, "validPeriod")}
                onPressEnter={this.getTableList}
              />
              <Select
                showSearch
                allowClear={true}
                onChange={(value) =>
                  this.onChangeFilter(value, "productCategory")
                }
                style={{ width: 260, marginLeft: 15 }}
                options={productCategoryList}
                placeholder="请选择产品类型"
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
          <Column title="产品编号" dataIndex="productCode" />
          <Column title="产品名称" dataIndex="productName" />
          <Column title="产品类别" dataIndex="productCategory" />
          <Column title="规格" dataIndex="model" />
          <Column title="型号" dataIndex="regularModel" />
          <Column title="产品批号" dataIndex="batchNo" />
          <Column title="单位" dataIndex="unitName" />
          <Column title="库存数量" dataIndex="stockAmount" />
          <Column title="生产日期" dataIndex="productDate" />
          <Column title="有效期" dataIndex="validPeriodDate" />
          <Column
            title="库位数量"
            dataIndex="stockNum"
            render={(value, record, index) => {
              return (
                <Space size="middle">
                  <a onClick={() => this.handleShowDetail(record)}>{value}</a>
                </Space>
              );
            }}
          />
        </Table>
        {/* 编辑弹窗 */}
        {showDetailDialog && (
          <EditDialog
            title="商品库存详情"
            data={{ productInventoryList, currentMsg }}
            onClosed={() => {
              dispatch({
                type: "realInventoryModel/save",
                payload: {
                  showDetailDialog: false,
                },
              });
            }}
          />
        )}
      </ContentWrap>
    );
  }
}

export default connect(({ realInventoryModel }) => ({
  realInventoryModel,
}))(RealTimeInventory);
