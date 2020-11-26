import React from "react";
import { connect } from "dva";
import { Table, Button, Space, Modal, Input, Select } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import EditDialog from "./editDialog";
import ContentBox from "../../../components/contentWrap";
import { OpreationBar } from "wrapd";
import "./index.scss";
const { Column } = Table;

class SalesmanManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditDialog: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "salesmanManageModel/customerList" });

    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "salesmanManageModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.salesmanManageModel;
    dispatch({
      type: "salesmanManageModel/save",
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
      dispatch({ type: "salesmanManageModel/userSalersNewList" });
      dispatch({
        type: "salesmanManageModel/save",
        payload: {
          showEditDialog: true,
          currentMsg: {},
          dialogTitle: "新增",
        },
      });
    }
  };

  handleEdit = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "salesmanManageModel/customerSalerDetail",
      payload: {
        userId: msg.userId,
      },
    });
  };

  handleSwitch = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "salesmanManageModel/save",
      payload: {
        switchDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  handleCloseSwitchDialog = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "salesmanManageModel/save",
      payload: {
        switchDialog: false,
        dialogBtnLoading: false,
      },
    });
  };

  handleSave = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: "salesmanManageModel/customerSalerSave",
      payload: { ...values },
    });
  };

  filterChange = (value, key) => {
    const { dispatch } = this.props;
    dispatch({
      type: "salesmanManageModel/save",
      payload: {
        [key]: value,
      },
    });
    if (key === "keyword") return;
    this.getTableList();
  };

  render() {
    const { dispatch } = this.props;
    const {
      showEditDialog,
      pagination,
      dialogTitle,
      currentMsg,
      loading,
      data,
      switchDialog,
      dialogBtnLoading,
      keyword,
      userList,
      customerList,
      isEnable,
    } = this.props.salesmanManageModel;
    const { current, size, total } = pagination;
    return (
      <ContentBox loading={loading} props={this.props} hasRetrun={true}>
        <OpreationBar
          total={false}
          custom={
            <>
              <div
                style={{ width: 260, display: "inline-block", marginRight: 15 }}
              >
                <Input
                  style={{ width: 225 }}
                  placeholder="业务员姓名"
                  value={keyword}
                  onChange={(e) => this.filterChange(e.target.value, "keyword")}
                  allowClear
                />
                <Button
                  style={{ position: "relative", left: "-3px", top: "1px" }}
                  onClick={this.getTableList}
                  icon={<SearchOutlined />}
                />
              </div>
              <Select
                placeholder="请选择启用、停用状态"
                allowClear={true}
                value={isEnable}
                onChange={(value) => this.filterChange(value, "isEnable")}
                style={{ width: 260, marginRight: 15 }}
                options={[
                  { value: false, label: "停用" },
                  { value: true, label: "启用" },
                ]}
              />
            </>
          }
        />
        <OpreationBar
          buttonList={[{ key: "add", label: "新增", icon: <PlusOutlined /> }]}
          total={total}
          onClick={this.handleClick}
        />
        <Table
          bordered
          rowKey={(record, index) => index}
          scroll={{ x: 1500 }}
          dataSource={data}
          pagination={{
            position: ["bottomCenter"],
            current: current,
            total: total,
            pageSize: size,
            onChange: this.changePagination,
            onShowSizeChange: this.changePagination,
          }}
        >
          <Column
            title="序号"
            render={(value, record, index) => index + 1}
            width={65}
          />
          <Column title="业务员" dataIndex="userName" width={120} />
          <Column
            title="关联客户"
            dataIndex="customerList"
            render={(value) => {
              const nameList = (value || []).map((item) => item.customerName);
              return nameList.join("、");
            }}
          />
          <Column
            title="操作"
            dataIndex="isEnable"
            fixed="right"
            width={110}
            render={(value, record, index) => (
              <Space size="middle">
                <a onClick={() => this.handleEdit(record)}>编辑</a>
                {/* <a onClick={() => this.handleSwitch(record)}>
                  {value ? "停用" : "启用"}
                </a> */}
              </Space>
            )}
          />
        </Table>

        {/* 启用\禁用弹窗 */}
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
                  type: "salesmanManageModel/customerSalerSetEnable",
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
            sourceList={{ userList, customerList }}
            onClosed={() => {
              dispatch({
                type: "salesmanManageModel/save",
                payload: {
                  showEditDialog: false,
                  dialogBtnLoading: false,
                },
              });
            }}
            onOk={this.handleSave}
          />
        )}
      </ContentBox>
    );
  }
}

export default connect(({ salesmanManageModel }) => ({
  salesmanManageModel,
}))(SalesmanManage);
