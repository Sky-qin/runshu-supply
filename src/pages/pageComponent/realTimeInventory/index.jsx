import React from "react";
import { connect } from "dva";
import { Space, Table } from "antd";
import EditDialog from "./editDialog";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";
import "./index.scss";

const { Column } = Table;

class RealTimeInventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "realInventoryModel/storageList",
    });
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
    } = this.props.realInventoryModel;
    const { current, size, total } = pagination;
    return (
      <ContentWrap loading={loading}>
        <OpreationBar total={total} />
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
          <Column title="规格型号" dataIndex="model" />
          <Column title="常见型号" dataIndex="regularModel" />
          <Column title="产品批号" dataIndex="batchNo" />
          <Column title="单位" dataIndex="unitName" />
          <Column title="库存数量" dataIndex="stockAmount" />
          <Column title="生产日期" dataIndex="productDate" />
          <Column title="有效期至" dataIndex="validPeriodDate" />
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
