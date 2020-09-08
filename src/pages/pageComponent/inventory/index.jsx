import React, { Children } from "react";
import { connect } from "dva";
import { Button, Space, Table, Modal, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import EditDialog from "./editDialog";
// import zhCN from "antd/es/locale/zh_CN";
// import T from "prop-types";
import ContentWrap from "../../../components/contentWrap";
import "./index.scss";

const { Column } = Table;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

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

  render() {
    const { dispatch } = this.props;
    const {
      showEditDialog,
      dialogTitle,
      currentMsg,
      deleteDialog,
      storageList,
      pagination,
      data,
      loading,
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
                <a onClick={() => this.handleEdit(record)}>查看详情</a>
              </Space>
            )}
          />
        </Table>
        {/* 编辑弹窗 */}
        {/* {showEditDialog && (
          <EditDialog
            title={dialogTitle}
            data={currentMsg}
            onClosed={() => {
              dispatch({
                type: "inventory/save",
                payload: {
                  showEditDialog: false,
                },
              });
            }}
            onOk={this.handleSave}
          />
        )} */}
      </ContentWrap>
    );
  }
}

export default connect(({ inventory }) => ({
  inventory,
}))(Inventory);
