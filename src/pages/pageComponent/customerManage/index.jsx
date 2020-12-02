import React from "react";
import { connect } from "dva";
import { Table, Input, Button, Space, Modal, Select } from "antd";
import {
  SearchOutlined,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import EditDialog from "./editDialog";
import { OpreationBar, ContentBox } from "wrapd";
import RetrunAffix from "../../../components/RetrunAffix";
import { Prefix } from "../../../utils/config";
import WrapView from "../../../components/WrapView";
import ContactManage from "./contactManage";

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

  handleEdit = (msg, key) => {
    const { dispatch } = this.props;
    dispatch({
      type: "customerManageModel/save",
      payload: {
        currentMsg: { ...msg },
        [key]: true,
        dialogTitle: "编辑客户",
      },
    });
    if (key === "showEditDialog") {
      if (msg.type === "3") {
        if (!msg.hospitalId) return;
        dispatch({
          type: "customerManageModel/getDePartmentByHsp",
          payload: {
            id: msg.hospitalId,
          },
        });
      }
    }
    if (key === "showContactDialog") {
      const { contactList } = msg;
      let contacts = [];
      let unkey = 1;
      (contactList || []).map((item, index) => {
        unkey = unkey + 1;
        return contacts.push({ ...item, unkey });
      });
      dispatch({
        type: "customerManageModel/save",
        payload: {
          customerId: msg.id,
          contacts,
          unkey,
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

    if (key === "keyword") return;
    this.getTableList();
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
      if (value) {
        dispatch({
          type: "customerManageModel/getDePartmentByHsp",
          payload: {
            id: value,
          },
        });
      }

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

  // 手动添加联系人
  handleAdd = () => {
    const { dispatch, customerManageModel } = this.props;
    const { contacts, unkey } = customerManageModel;
    let list = [...contacts];
    list.push({
      unkey: unkey + 1,
      contact: "",
      phone: "",
      position: "",
      jobContent: "",
    });
    dispatch({
      type: "customerManageModel/save",
      payload: {
        unkey: unkey + 1,
        contacts: list,
      },
    });
  };
  // 手动删除
  handleDelete = (list) => {
    const { dispatch } = this.props;
    dispatch({
      type: "customerManageModel/save",
      payload: {
        contacts: list,
      },
    });
  };

  // 修改联系人
  changeContactInfo = (list) => {
    const { dispatch } = this.props;
    dispatch({
      type: "customerManageModel/save",
      payload: {
        contacts: list,
      },
    });
  };

  saveContact = (values) => {
    const { dispatch, customerManageModel } = this.props;
    const { contacts, customerId } = customerManageModel;
    dispatch({
      type: "customerManageModel/customerContactSave",
      payload: { customerId, contactList: contacts },
    });
  };

  render() {
    const { dispatch, history } = this.props;
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
      isEnable,
      type,
      showContactDialog,
      contacts,
    } = this.props.customerManageModel;
    const { current, size, total } = pagination;
    return (
      <WrapView history={history}>
        <ContentBox loading={loading} extend={<RetrunAffix {...this.props} />}>
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
                    placeholder="输入客户名称"
                    value={name}
                    onChange={(e) =>
                      this.onChangeFilter(e.target.value, "name")
                    }
                    onPressEnter={this.getTableList}
                    allowClear
                  />
                  <Button
                    style={{ position: "relative", left: "-3px", top: "1px" }}
                    onClick={this.getTableList}
                    icon={<SearchOutlined />}
                  />
                </div>
                <Select
                  placeholder="请选择客户类型"
                  allowClear={true}
                  value={type}
                  onChange={(value) => this.onChangeFilter(value, "type")}
                  style={{ width: 260, marginRight: 15 }}
                  options={customerTypeList}
                />
                <Select
                  placeholder="请选择启用、停用状态"
                  allowClear={true}
                  value={isEnable}
                  onChange={(value) => this.onChangeFilter(value, "isEnable")}
                  style={{ width: 260, marginRight: 15 }}
                  options={[
                    { value: 0, label: "停用" },
                    { value: 1, label: "启用" },
                  ]}
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
                params: { name },
                url: `${Prefix}/supply/customer/export`,
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
                let sales = [];
                (value || []).map((item) => {
                  if (item.isLocal && item.isManager) {
                    return sales.push(`${item.userName}（销售代表、属地经理）`);
                  }
                  if (item.isManager) {
                    return sales.push(`${item.userName}（销售代表）`);
                  }
                  if (item.isLocal) {
                    return sales.push(`${item.userName}（属地经理）`);
                  }
                  return null;
                });
                return (sales || []).join("、");
              }}
            />
            <Column
              title="联系人"
              dataIndex="contactList"
              width={120}
              render={(value) => {
                const names = (value || []).map((item) => item.contact);
                return names.join("、");
              }}
            />

            <Column title="创建日期" width={120} dataIndex="createTime" />
            <Column
              title="操作"
              dataIndex="isEnable"
              width={150}
              render={(value, record, index) => {
                return (
                  <Space size="middle">
                    <a
                      onClick={() => this.handleEdit(record, "showEditDialog")}
                    >
                      编辑
                    </a>
                    <a onClick={() => this.handleSwitch(record)}>
                      {value ? "停用" : "启用"}
                    </a>
                    <a
                      onClick={() =>
                        this.handleEdit(record, "showContactDialog")
                      }
                    >
                      联系人
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
          {showContactDialog && (
            <ContactManage
              data={contacts}
              loading={dialogBtnLoading}
              addInfo={this.handleAdd}
              onDelete={this.handleDelete}
              onChange={this.changeContactInfo}
              onSubmit={this.saveContact}
              onClosed={() => {
                dispatch({
                  type: "customerManageModel/save",
                  payload: {
                    showContactDialog: false,
                    dialogBtnLoading: false,
                  },
                });
              }}
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
        </ContentBox>
      </WrapView>
    );
  }
}

export default connect(({ customerManageModel }) => ({
  customerManageModel,
}))(CustomerManage);
