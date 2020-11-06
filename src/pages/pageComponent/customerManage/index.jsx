import React from "react";
import { connect } from "dva";
import { Table, Input, Button, Space, Modal } from "antd";
import {
  SearchOutlined,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import EditDialog from "./editDialog";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";

const { Column } = Table;
class CustomerManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "customerManageModel/getHospital" });
    dispatch({ type: "customerManageModel/getCustomerType" });

    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "customerManageModel/getTableList",
    });
  };

  handleClick = (key) => {
    const { dispatch } = this.props;
    if (key === "add") {
      dispatch({
        type: "customerManageModel/save",
        payload: {
          showEditDialog: true,
          currentMsg: {},
          dialogTitle: "新增客户",
        },
      });
    }
  };

  handleEdit = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "customerManageModel/save",
      payload: {
        currentMsg: { ...msg },
        showEditDialog: true,
        dialogTitle: "编辑客户",
      },
    });
    if (msg.type === "3") {
      dispatch({
        type: "customerManageModel/getDePartmentByHsp",
        payload: {
          id: msg.hospitalId,
        },
      });
    }
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.customerManageModel;
    dispatch({
      type: "customerManageModel/save",
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
    const { pagination } = this.props.customerManageModel;
    dispatch({
      type: "customerManageModel/save",
      payload: {
        [key]: value,
        pagination: {
          ...pagination,
          current: 1,
        },
      },
    });
  };

  onFormChange = (value, key, callBack) => {
    const { dispatch, customerManageModel } = this.props;
    const { currentMsg } = customerManageModel;
    let tmp = { [key]: value };
    if (key === "type") {
      tmp = { ...tmp, hospitalId: null, departmentId: null };
      callBack({ hospitalId: null });
      callBack({ departmentId: null });
    }
    if (key === "hospitalId") {
      dispatch({
        type: "customerManageModel/getDePartmentByHsp",
        payload: {
          id: value,
        },
      });
      tmp = { ...tmp, departmentId: null };
      callBack({ departmentId: null });
    }

    dispatch({
      type: "customerManageModel/save",
      payload: {
        currentMsg: { ...currentMsg, ...tmp },
      },
    });
  };

  handleSave = (values) => {
    const { dispatch, customerManageModel } = this.props;
    const { currentMsg } = customerManageModel;
    if (currentMsg.id) {
      dispatch({
        type: "customerManageModel/updateCustomer",
        payload: { ...values, id: currentMsg.id },
      });
    } else {
      dispatch({
        type: "customerManageModel/addCustomer",
        payload: { ...values },
      });
    }
  };

  handleCloseSwitchDialog = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "customerManageModel/save",
      payload: {
        switchDialog: false,
        dialogBtnLoading: false,
      },
    });
  };

  handleSwitch = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "customerManageModel/save",
      payload: {
        switchDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  render() {
    const { dispatch } = this.props;
    const {
      pagination,
      data,
      loading,
      name,
      showEditDialog,
      dialogTitle,
      currentMsg,
      dialogBtnLoading,
      hospitalList,
      customerTypeList,
      departmentList,
      switchDialog,
    } = this.props.customerManageModel;
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
                  placeholder="输入客户名称"
                  value={name}
                  onChange={(e) => this.onChangeFilter(e.target.value, "name")}
                  onPressEnter={this.getTableList}
                  allowClear
                />
                <Button
                  style={{ position: "relative", left: "-3px", top: "1px" }}
                  onClick={this.getTableList}
                  icon={<SearchOutlined />}
                />
              </div>
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
              params: { name },
              url: "/supply/customer/export",
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
          <Column title="客户名称" dataIndex="name" width={180} />
          <Column title="客户类型" dataIndex="typeDesc" width={120} />
          <Column title="关联医院" dataIndex="hospitalName" width={260} />
          <Column title="关联库位" dataIndex="stockName" width={180} />
          <Column title="科室" dataIndex="departmentName" width={120} />
          <Column
            title="业务员"
            dataIndex="salesList"
            width={150}
            render={(value) => {
              const sales = (value || []).map((item) => item.userName);
              return (sales || []).toString();
            }}
          />
          <Column title="创建日期" width={120} dataIndex="createTime" />
          <Column
            title="操作"
            dataIndex="isEnable"
            width={120}
            render={(value, record, index) => {
              return (
                <Space size="middle">
                  <a onClick={() => this.handleEdit(record)}>编辑</a>
                  <a onClick={() => this.handleSwitch(record)}>
                    {value ? "停用" : "启用"}
                  </a>
                </Space>
              );
            }}
          />
        </Table>
        {showEditDialog && (
          <EditDialog
            title={dialogTitle}
            data={currentMsg}
            loading={dialogBtnLoading}
            sourceList={{
              departmentList,
              hospitalList,
              customerTypeList,
            }}
            onFormChange={this.onFormChange}
            onClosed={() => {
              dispatch({
                type: "customerManageModel/save",
                payload: {
                  showEditDialog: false,
                  dialogBtnLoading: false,
                },
              });
            }}
            onOk={this.handleSave}
          />
        )}

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
                const { id, isEnable } = currentMsg;
                dispatch({
                  type: "customerManageModel/updateCustomer",
                  payload: {
                    id,
                    isEnable: isEnable === 1 ? 0 : 1,
                  },
                });
              }}
            >
              确定
            </Button>,
          ]}
          maskClosable={false}
        >
          你确定要
          {currentMsg && currentMsg.isEnable === 1 ? "停用" : "启用"}嘛?
        </Modal>
      </ContentWrap>
    );
  }
}

export default connect(({ customerManageModel }) => ({
  customerManageModel,
}))(CustomerManage);
