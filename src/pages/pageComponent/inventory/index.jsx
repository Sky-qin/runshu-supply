import React from "react";
import { connect } from "dva";
import {
  Space,
  Table,
  Select,
  Input,
  InputNumber,
  Button,
  TreeSelect,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import EditDialog from "./editDialog";
import ContentWrap from "../../../components/contentWrap";
import TotalBoard from "../../../components/TotalBoard";
import OpreationBar from "../../../components/OpreationBar";
import "./index.scss";

const { Column } = Table;

class Inventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "inventory/storageList" });
    dispatch({ type: "inventory/queryCatetoryTree" });
    this.getStockStatistic();
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "inventory/queryInventoryList",
    });
  };

  getStockStatistic = () => {
    const { dispatch } = this.props;

    dispatch({ type: "inventory/stockStatistic" });
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
    this.getStockStatistic();
  };

  onChangeFilter = (value, key, extend) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.inventory;
    let temp = {};
    if (key === "categoryCode") {
      temp = value
        ? {
            category: {
              categoryCode: value,
              level: extend.triggerNode.props.level,
            },
          }
        : { category: {} };
    }

    dispatch({
      type: "inventory/save",
      payload: {
        [key]: value,
        ...temp,
        pagination: {
          ...pagination,
          current: 1,
        },
      },
    });
    if (key === "validPeriod" || key === "keyword") return;
    this.getTableList();
    this.getStockStatistic();
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
      categoryCode,
      boardInfo,
      boardLoading,
    } = this.props.inventory;
    const { current, size, total } = pagination;
    return (
      <>
        <TotalBoard
          onClick={this.clickToList}
          data={boardInfo}
          loading={boardLoading}
        />
        <ContentWrap loading={loading}>
          <OpreationBar
            custom={
              <>
                <div
                  style={{
                    width: 260,
                    display: "inline-block",
                    marginRight: 15,
                  }}
                >
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
                    onClick={() => {
                      this.getTableList();
                      this.getStockStatistic();
                    }}
                    icon={<SearchOutlined />}
                  />
                </div>

                <InputNumber
                  placeholder="请输入有效期"
                  value={validPeriod}
                  style={{ width: 260, marginRight: 15 }}
                  onChange={(value) =>
                    this.onChangeFilter(value, "validPeriod")
                  }
                  onPressEnter={() => {
                    this.getTableList();
                    this.getStockStatistic();
                  }}
                />
                <Select
                  placeholder="请选择库位"
                  showSearch
                  optionFilterProp="label"
                  dropdownMatchSelectWidth={false}
                  allowClear={true}
                  value={stockId || null}
                  onChange={(value) => this.onChangeFilter(value, "stockId")}
                  style={{ width: 260, marginRight: 15 }}
                  options={storageList}
                />

                {/* <Select
                  placeholder="请选择产品类型"
                  optionFilterProp="label"
                  showSearch
                  allowClear={true}
                  value={productCategory || null}
                  onChange={(value) =>
                    this.onChangeFilter(value, "productCategory")
                  }
                  style={{ width: 260, marginRight: 15 }}
                  options={productCategoryList}
                /> */}

                <TreeSelect
                  filterTreeNode
                  treeNodeFilterProp="label"
                  placeholder="请选择分类"
                  treeData={productCategoryList}
                  value={categoryCode || null}
                  style={{ width: 260, marginRight: 15 }}
                  allowClear
                  onChange={(value, label, extend) => {
                    this.onChangeFilter(value, "categoryCode", extend);
                  }}
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
            <Column title="型号" width={120} dataIndex="model" />
            <Column title="规格" width={120} dataIndex="regularModel" />
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
