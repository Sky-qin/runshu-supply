import React from "react";
import { connect } from "dva";
import { Table, Button, Space, Modal, Input, Select } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import EditDialog from "./editDialog";
import { OpreationBar, ContentBox } from "wrapd";
import RetrunAffix from "../../../components/RetrunAffix";
import "./index.scss";
const { Column } = Table;

class SupplyCompanyManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditDialog: false,
    };
  }

  componentDidMount() {
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "supplyCompanyManageModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.supplyCompanyManageModel;
    dispatch({
      type: "supplyCompanyManageModel/save",
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
        type: "supplyCompanyManageModel/save",
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
      type: "supplyCompanyManageModel/save",
      payload: {
        showEditDialog: true,
        currentMsg: { ...msg },
        dialogTitle: "编辑",
      },
    });
  };

  handleSwitch = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "supplyCompanyManageModel/save",
      payload: {
        switchDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  handleCloseSwitchDialog = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "supplyCompanyManageModel/save",
      payload: {
        switchDialog: false,
        dialogBtnLoading: false,
      },
    });
  };

  handleSave = (values) => {
    const { dispatch } = this.props;
    const { dialogTitle, currentMsg } = this.props.supplyCompanyManageModel;
    if (dialogTitle === "编辑") {
      dispatch({
        type: "supplyCompanyManageModel/supplyCompanySave",
        payload: { ...values, id: currentMsg.id },
      });
    } else {
      dispatch({
        type: "supplyCompanyManageModel/supplyCompanySave",
        payload: { ...values },
      });
    }
  };

  filterChange = (value, key) => {
    const { dispatch } = this.props;
    dispatch({
      type: "supplyCompanyManageModel/save",
      payload: {
        [key]: value,
      },
    });
    if (key === "keyweord") return;
    dispatch({ type: "supplyCompanyManageModel/getTableList" });
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
      isEnable,
    } = this.props.supplyCompanyManageModel;
    const { current, size, total } = pagination;
    return (
      <ContentBox loading={loading} extend={<RetrunAffix {...this.props} />}>
        <OpreationBar
          total={false}
          custom={
            <>
              <div
                style={{ width: 260, display: "inline-block", marginRight: 15 }}
              >
                <Input
                  style={{ width: 225 }}
                  placeholder="输入供货公司"
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
          <Column title="供货公司" dataIndex="companyName" width={180} />
          <Column title="联系人" dataIndex="contact" width={100} />
          <Column title="联系方式" dataIndex="phone" width={100} />
          <Column title="创建时间" dataIndex="createTime" width={120} />
          <Column title="更新时间" dataIndex="updateTime" width={120} />
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

        {/* 删除弹窗 */}
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
                  type: "supplyCompanyManageModel/supplyCompanySetEnable",
                });
              }}
            >
              确定
            </Button>,
          ]}
          maskClosable={false}
        >
          你确定要{currentMsg.isEnable ? "停用" : "启用"}嘛?
        </Modal>

        {showEditDialog && (
          <EditDialog
            title={dialogTitle}
            data={currentMsg}
            loading={dialogBtnLoading}
            onClosed={() => {
              dispatch({
                type: "supplyCompanyManageModel/save",
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

export default connect(({ supplyCompanyManageModel }) => ({
  supplyCompanyManageModel,
}))(SupplyCompanyManage);
