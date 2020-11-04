import React from "react";
import { connect } from "dva";
import { Table, Input, Button, Select, Space, Modal } from "antd";
import {
  SearchOutlined,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import EditDialog from "./editDialog";
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

    dispatch({ type: "inventoryManageModel/getStockTypeList" });
    dispatch({ type: "inventoryManageModel/customerList" });

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

  handleClick = (key) => {
    const { dispatch } = this.props;
    if (key === "add") {
      dispatch({
        type: "inventoryManageModel/save",
        payload: {
          showEditDialog: true,
          currentMsg: {},
          dialogTitle: "新增",
        },
      });
    }
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

  handleSave = (values) => {
    const { dispatch } = this.props;
    const { currentMsg, dialogTitle } = this.props.inventoryManageModel;
    if (dialogTitle === "编辑") {
      dispatch({
        type: "inventoryManageModel/supplyStockSave",
        payload: { id: currentMsg.id, ...values },
      });
    } else {
      dispatch({
        type: "inventoryManageModel/supplyStockSave",
        payload: { ...values },
      });
    }
  };

  handleEdit = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "inventoryManageModel/save",
      payload: {
        currentMsg: msg,
        showEditDialog: true,
        dialogTitle: "编辑",
      },
    });
  };

  handleSwitch = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "inventoryManageModel/save",
      payload: {
        switchDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  handleCloseSwitchDialog = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "inventoryManageModel/save",
      payload: {
        switchDialog: false,
        dialogBtnLoading: false,
      },
    });
  };

  render() {
    const { dispatch } = this.props;
    const {
      pagination,
      data,
      loading,
      stockTypeList,
      keyword,
      type,
      showEditDialog,
      dialogTitle,
      currentMsg,
      dialogBtnLoading,
      customerList,
      switchDialog,
    } = this.props.inventoryManageModel;
    const { current, size, total } = pagination;
    return (
      <ContentWrap loading={loading}>
        <OpreationBar
          custom={
            <>
              <div
                style={{ width: 260, display: "inline-block", marginRight: 15 }}
              >
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
                style={{ width: 260, marginRight: 15 }}
                onChange={(value) => this.onChangeFilter(value, "type")}
              />
            </>
          }
          total={false}
        />
        <OpreationBar
          buttonList={[{ key: "add", label: "新增", icon: <PlusOutlined /> }]}
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
          onClick={this.handleClick}
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
          {/* <Column title="库位编码" dataIndex="stockNo" /> */}
          <Column title="库位名称" dataIndex="name" />
          <Column title="库位类别" dataIndex="typeName" width={120} />
          <Column
            title="关联客户"
            dataIndex="customerList"
            render={(value) => {
              return (value || []).join("、");
            }}
          />
          {/* <Column title="地址" dataIndex="address" /> */}
          {/* <Column title="电话" dataIndex="phone" /> */}
          <Column
            title="操作"
            dataIndex="isEnable"
            fixed="right"
            width={110}
            render={(value, record, index) => (
              <Space size="middle">
                <a onClick={() => this.handleEdit(record)}>编辑</a>
                <a onClick={() => this.handleSwitch(record)}>
                  {value ? "停用" : "启用"}
                </a>
              </Space>
            )}
          />
        </Table>
        {/* 启用\停用弹窗 */}
        <Modal
          title="提示"
          visible={switchDialog}
          onCancel={this.handleCloseSwitchDialog}
          footer={[
            <Button key="cancel" onClick={this.handleCloseSwitchDialog}>
              取消
            </Button>,
            <Button
              key="ok"
              type="primary"
              loading={dialogBtnLoading}
              onClick={() => {
                dispatch({
                  type: "inventoryManageModel/supplyStockSetEnable",
                });
              }}
            >
              确定
            </Button>,
          ]}
          maskClosable={false}
        >
          你确定要{currentMsg && currentMsg.isEnable ? "停用" : "启用"}嘛?
        </Modal>
        {showEditDialog && (
          <EditDialog
            title={dialogTitle}
            data={currentMsg}
            loading={dialogBtnLoading}
            sourceList={{ stockTypeList, customerList }}
            onClosed={() => {
              dispatch({
                type: "inventoryManageModel/save",
                payload: {
                  showEditDialog: false,
                  dialogBtnLoading: false,
                },
              });
            }}
            onOk={this.handleSave}
          />
        )}
      </ContentWrap>
    );
  }
}

export default connect(({ inventoryManageModel }) => ({
  inventoryManageModel,
}))(InventoryManage);
