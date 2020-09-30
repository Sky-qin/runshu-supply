import React from "react";
import { connect } from "dva";
import { Space, Table, InputNumber, Select, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import EditDialog from "./editDialog";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";
import TotalBoard from "../../../components/TotalBoard";
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
    if (key === "validPeriod" || key === "keyword") return;
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

  clickToList = (key) => {
    const { history, dispatch } = this.props;
    dispatch({ type: "entryModel/save", payload: { activeKey: key } });
    history.push(`/entry/${key}`);
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
      validPeriod,
      productCategory,
      keyword,
    } = this.props.realInventoryModel;
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
                  style={{ width: 260, marginLeft: 15 }}
                  value={validPeriod || null}
                  onChange={(value) =>
                    this.onChangeFilter(value, "validPeriod")
                  }
                  onPressEnter={this.getTableList}
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
            dataSource={data}
            scroll={{ x: 1300 }}
            pagination={{
              position: ["bottomCenter"],
              current: current,
              total: total || 0,
              pageSize: size,
              onChange: this.changePagination,
              onShowSizeChange: this.changePagination,
            }}
          >
            <Column title="产品编号" dataIndex="productCode" width={125} />
            <Column title="产品名称" dataIndex="productName" width={160} />
            <Column title="产品类别" dataIndex="productCategory" width={160} />
            <Column title="规格" dataIndex="model" width={120} />
            <Column title="型号" dataIndex="regularModel" width={120} />
            <Column title="产品批号" dataIndex="batchNo" width={120} />
            <Column title="单位" dataIndex="unitName" width={80} />
            <Column title="库存数量" dataIndex="stockAmount" width={120} />
            <Column title="生产日期" dataIndex="productDate" width={120} />
            <Column title="有效期" dataIndex="validPeriodDate" width={120} />
            <Column
              title="库位数量"
              dataIndex="stockNum"
              width={120}
              fixed="right"
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
      </>
    );
  }
}

export default connect(({ realInventoryModel }) => ({
  realInventoryModel,
}))(RealTimeInventory);
