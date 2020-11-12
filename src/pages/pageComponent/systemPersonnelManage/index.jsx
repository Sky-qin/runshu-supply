import React from "react";
import { connect } from "dva";
import { Table, Button, Space, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import EditDialog from "./editDialog";
import ContentBox from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";
import "./index.scss";
const { Column } = Table;

class SystemPersonnelManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditDialog: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "personnelManage/queryUserRole",
    });
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "personnelManage/queryUser",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.personnelManage;
    dispatch({
      type: "personnelManage/save",
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
        type: "personnelManage/save",
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
      type: "personnelManage/save",
      payload: {
        showEditDialog: true,
        currentMsg: { ...msg },
        dialogTitle: "编辑",
      },
    });
  };

  handleDelete = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "personnelManage/save",
      payload: {
        deleteDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  handleCloseDeleteDialog = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "personnelManage/save",
      payload: {
        deleteDialog: false,
      },
    });
  };

  handleSave = (values) => {
    const { dispatch } = this.props;
    const { dialogTitle } = this.props.personnelManage;
    if (dialogTitle === "编辑") {
      dispatch({
        type: "personnelManage/updateUser",
        payload: { ...values },
      });
    } else {
      dispatch({
        type: "personnelManage/saveUser",
        payload: { ...values },
      });
    }
  };

  renderAuthority = (isSale, internalWork) => {
    let authorityList = [];
    if (isSale) authorityList.push("销售端");
    if (internalWork) authorityList.push("内勤端");
    if (authorityList.length > 0) {
      return (
        <span className="color-green">
          （{`${authorityList.join("、")}小程序已授权`}）
        </span>
      );
    }
  };

  render() {
    const { dispatch } = this.props;
    const {
      showEditDialog,
      deleteDialog,
      pagination,
      dialogTitle,
      currentMsg,
      loading,
      data,
      userRoleList,
    } = this.props.personnelManage;
    const { current, size, total } = pagination;
    return (
      <ContentBox loading={loading}>
        <OpreationBar
          buttonList={[{ key: "add", label: "新增", icon: <PlusOutlined /> }]}
          total={total}
          onClick={this.handleClick}
        />
        <Table
          bordered
          rowKey={(record, index) => index}
          dataSource={data}
          pagination={{
            position: ["bottomCenter"],
            current,
            total,
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
          <Column title="用户名" dataIndex="userName" />
          <Column title="手机号" dataIndex="userPhone" />
          <Column
            title="角色"
            dataIndex="roleName"
            render={(value, record) => {
              const { wxCode, isSale, internalWork } = record;
              return (
                <span>
                  {value}
                  {wxCode && this.renderAuthority(isSale, internalWork)}
                </span>
              );
            }}
          />
          <Column title="创建日期" dataIndex="createTime" />
          <Column
            title="操作"
            dataIndex="name"
            width={110}
            render={(value, record, index) => (
              <Space size="middle">
                <a onClick={() => this.handleEdit(record)}>编辑</a>
                <a onClick={() => this.handleDelete(record)}>删除</a>
              </Space>
            )}
          />
        </Table>

        {/* 删除弹窗 */}
        <Modal
          title="提示"
          visible={deleteDialog}
          onCancel={this.handleCloseDeleteDialog}
          footer={[
            <Button key="cancel" onClick={this.handleCloseDeleteDialog}>
              取消
            </Button>,
            <Button
              key="ok"
              type="primary"
              onClick={() => {
                dispatch({
                  type: "personnelManage/deleteUser",
                });
              }}
            >
              确定
            </Button>,
          ]}
          maskClosable={false}
        >
          你确定要删除用户 {currentMsg.userName} 吗？
        </Modal>

        {showEditDialog && (
          <EditDialog
            title={dialogTitle}
            data={currentMsg}
            sourceList={{ userRoleList }}
            onClosed={() => {
              dispatch({
                type: "personnelManage/save",
                payload: {
                  showEditDialog: false,
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

export default connect(({ personnelManage }) => ({
  personnelManage,
}))(SystemPersonnelManage);
