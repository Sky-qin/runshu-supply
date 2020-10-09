import React from "react";
import { connect } from "dva";
import { Space, Table, Select, Input, InputNumber, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import EditDialog from "./editDialog";
import ContentWrap from "../../../components/contentWrap";
import TotalBoard from "../../../components/TotalBoard";
import OpreationBar from "../../../components/OpreationBar";
import "./index.scss";

const { Column } = Table;
const { Search } = Input;

class Inventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "inventory/storageList" });
    dispatch({ type: "inventory/queryProductCategory" });
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "inventory/queryInventoryList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.inventory;
    dispatch({
      type: "inventory/save",
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
    const { pagination } = this.props.inventory;
    dispatch({
      type: "inventory/save",
      payload: {
        [key]: value,
        pagination: {
          ...pagination,
          current: 1,
        },
      },
    });
    if (key === "validPeriod" || key === "keyword") return;
    this.getTableList();
  };

  handleShowDetail = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "inventory/save",
      payload: {
        currentMsg: { ...msg },
      },
    });

    dispatch({
      type: "inventory/queryInventoryProduct",
    });
  };

  changeListData = (current, size) => {
    const { dispatch } = this.props;
    const { inventoryPagination } = this.props.inventory;
    dispatch({
      type: "inventory/save",
      payload: {
        inventoryPagination: {
          ...inventoryPagination,
          current,
          size,
        },
      },
    });

    dispatch({ type: "inventory/queryInventoryProduct" });
  };

  clickToList = (key) => {
    const { history, dispatch } = this.props;
    dispatch({ type: "entryModel/save", payload: { activeKey: key } });
    history.push(`/entry/${key}`);
  };

  render() {
    const { dispatch } = this.props;
    const {
      showDetailDialog,
      inventoryPagination,
      inventoryList,
      currentMsg,
      storageList,
      pagination,
      data,
      loading,
      productCategoryList,
      keyword,
      validPeriod,
      stockId,
      productCategory,
    } = this.props.inventory;
    const { current, size, total } = pagination;
    return (
      <>
        <TotalBoard onClick={this.clickToList} />
        <ContentWrap loading={loading}>
          <OpreationBar
            custom={
              <>
                <div style={{ width: 260, display: "inline-block" }}>
                  <Input
                    style={{ width: 225 }}
                    placeholder="输入产品名称/编码"
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

                <InputNumber
                  placeholder="请输入有效期"
                  value={validPeriod}
                  style={{ width: 260, marginLeft: 15 }}
                  onChange={(value) =>
                    this.onChangeFilter(value, "validPeriod")
                  }
                  onPressEnter={this.getTableList}
                />
                <Select
                  optionFilterProp="label"
                  showSearch
                  allowClear={true}
                  value={stockId || null}
                  onChange={(value) => this.onChangeFilter(value, "stockId")}
                  style={{ width: 260, marginLeft: 15 }}
                  options={storageList}
                  placeholder="请选择库位"
                />
                <Select
                  showSearch
                  allowClear={true}
                  value={productCategory || null}
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
            scroll={{ x: 1500 }}
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
            <Column title="产品编号" width={120} dataIndex="productCode" />
            <Column title="产品名称" width={200} dataIndex="productName" />
            <Column title="产品类别" width={120} dataIndex="productCategory" />
            <Column title="规格" width={120} dataIndex="model" />
            <Column title="型号" width={120} dataIndex="regularModel" />
            <Column title="单位" width={80} dataIndex="unitName" />
            <Column title="库存数量" width={120} dataIndex="stockAmount" />
            <Column title="生产厂家" width={200} dataIndex="vendorName" />
            <Column title="库位" width={160} dataIndex="stockName" />
            <Column
              title="操作"
              dataIndex="name"
              fixed="right"
              width={120}
              render={(value, record, index) => (
                <Space size="middle">
                  <a onClick={() => this.handleShowDetail(record)}>查看详情</a>
                </Space>
              )}
            />
          </Table>
          {/* 编辑弹窗 */}
          {showDetailDialog && (
            <EditDialog
              title="库存详情"
              data={{ inventoryList, currentMsg, inventoryPagination }}
              onClosed={() => {
                dispatch({
                  type: "inventory/save",
                  payload: {
                    showDetailDialog: false,
                    inventoryPagination: {
                      current: 1,
                      size: 50,
                      total: 0,
                    },
                  },
                });
              }}
              onChange={this.changeListData}
            />
          )}
        </ContentWrap>
      </>
    );
  }
}

export default connect(({ inventory }) => ({
  inventory,
}))(Inventory);
