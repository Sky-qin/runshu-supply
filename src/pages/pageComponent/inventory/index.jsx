import React from "react";
import { connect } from "dva";
import { Space, Table, Select } from "antd";
import EditDialog from "./editDialog";
import ContentWrap from "../../../components/contentWrap";
import "./index.scss";

const { Column } = Table;

class Inventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "inventory/storageList",
    });
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
    const { dispatch, pagination } = this.props;
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
      stockId,
    } = this.props.inventory;
    const { current, size, total } = pagination;
    return (
      <ContentWrap loading={loading}>
        <div className="opreation-bar">
          {/* <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={this.handleAdd}
          >
            新增
          </Button> */}
          <div>
            <Select
              optionFilterProp="label"
              showSearch
              allowClear={true}
              onChange={(value) => this.onChangeFilter(value, "stockId")}
              style={{
                width: "260px",
              }}
              value={stockId || null}
              options={storageList}
              placeholder="请选择库位"
            />
          </div>
        </div>
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
          <Column title="单位" dataIndex="unitName" />
          <Column title="库存数量" dataIndex="stockAmount" />
          <Column title="生产厂家" dataIndex="vendorName" />
          <Column title="位置" dataIndex="stockName" />
          <Column
            title="操作"
            dataIndex="name"
            width={200}
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
    );
  }
}

export default connect(({ inventory }) => ({
  inventory,
}))(Inventory);
