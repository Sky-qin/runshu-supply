import React from "react";
import { connect } from "dva";
import { Table, Button, Space, Modal, Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { OpreationBar, ContentBox } from "wrapd";
import EditDialog from "./editDialog";
import RetrunAffix from "../../../components/RetrunAffix";
import WrapView from "../../../components/WrapView";
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
    const { isManagers = [], isLocals = [], userId } = values;
    let customerList = [];
    let customerIds = isManagers.concat(
      isLocals.filter((item) => {
        return isManagers.indexOf(item) < 0;
      })
    );
    customerIds.map((item) => {
      let temp = { customerId: item };
      if (isManagers.indexOf(item) >= 0) {
        temp = { ...temp, isManager: true };
      }
      if (isLocals.indexOf(item) >= 0) {
        temp = { ...temp, isLocal: true };
      }
      return customerList.push(temp);
    });

    dispatch({
      type: "salesmanManageModel/customerSalerSave",
      payload: { userId, customerList },
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
    const { dispatch, history } = this.props;
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
      // isEnable,
    } = this.props.salesmanManageModel;
    const { current, size, total } = pagination;
    return (
      <WrapView history={history}>
        <ContentBox loading={loading} extend={<RetrunAffix {...this.props} />}>
          <OpreationBar
            total={false}
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
                    placeholder="业务员姓名"
                    value={keyword}
                    onChange={(e) =>
                      this.filterChange(e.target.value, "keyword")
                    }
                    allowClear
                  />
                  <Button
                    style={{ position: "relative", left: "-3px", top: "1px" }}
                    onClick={this.getTableList}
                    icon={<SearchOutlined />}
                  />
                </div>
                {/* <Select
                placeholder="请选择启用、停用状态"
                allowClear={true}
                value={isEnable}
                onChange={(value) => this.filterChange(value, "isEnable")}
                style={{ width: 260, marginRight: 15 }}
                options={[
                  { value: false, label: "停用" },
                  { value: true, label: "启用" },
                ]}
              /> */}
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
            rowKey="userId"
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
                const nameList = [];
                (value || []).map((item) => {
                  if (item.isLocal && item.isManager) {
                    return nameList.push(
                      `${item.customerName}（销售代表、属地经理）`
                    );
                  }
                  if (item.isManager) {
                    return nameList.push(`${item.customerName}（销售代表）`);
                  }
                  if (item.isLocal) {
                    return nameList.push(`${item.customerName}（属地经理）`);
                  }
                  return null;
                });

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
      </WrapView>
    );
  }
}

export default connect(({ salesmanManageModel }) => ({
  salesmanManageModel,
}))(SalesmanManage);
