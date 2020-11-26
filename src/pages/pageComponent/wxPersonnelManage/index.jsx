import React from "react";
import { connect } from "dva";
import { Table, Button, Space, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import EditDialog from "./editDialog";
import ContentBox from "../../../components/contentWrap";
import { OpreationBar } from "wrapd";
import "./index.scss";
const { Column } = Table;

class WxPersonnelManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditDialog: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "wxPersonnelManage/getAllHospital",
    });
    dispatch({
      type: "wxPersonnelManage/queryUserRole",
    });
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "wxPersonnelManage/queryUser",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.wxPersonnelManage;
    dispatch({
      type: "wxPersonnelManage/save",
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
        type: "wxPersonnelManage/save",
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
      type: "wxPersonnelManage/save",
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
      type: "wxPersonnelManage/save",
      payload: {
        deleteDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  handleCloseDeleteDialog = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "wxPersonnelManage/save",
      payload: {
        deleteDialog: false,
      },
    });
  };

  handleSave = (values) => {
    const { dispatch } = this.props;
    const { dialogTitle } = this.props.wxPersonnelManage;
    if (dialogTitle === "编辑") {
      dispatch({
        type: "wxPersonnelManage/updateUser",
        payload: { ...values },
      });
    } else {
      dispatch({
        type: "wxPersonnelManage/saveUser",
        payload: { ...values },
      });
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
      hospitalList,
      userRoleList,
      dialogBtnLoading,
    } = this.props.wxPersonnelManage;
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
          <Column title="姓名" dataIndex="userName" />
          <Column title="手机号" dataIndex="userPhone" />
          {/* <Column title="医院" dataIndex="" /> */}
          <Column
            title="授权状态"
            dataIndex="wxCode"
            render={(value, record) => {
              return (
                <span className={value ? "color-green" : "color-red"}>
                  {value ? "已授权" : "未授权"}
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
              loading={dialogBtnLoading}
              onClick={() => {
                dispatch({
                  type: "wxPersonnelManage/deleteUser",
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
            loading={dialogBtnLoading}
            sourceList={{ hospitalList, userRoleList }}
            onClosed={() => {
              dispatch({
                type: "wxPersonnelManage/save",
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

export default connect(({ wxPersonnelManage }) => ({
  wxPersonnelManage,
}))(WxPersonnelManage);
