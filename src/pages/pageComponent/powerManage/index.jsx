import React from "react";
import { connect } from "dva";
import { Table, Button, Space, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import EditDialog from "./editDialog";
import ContentBox from "../../../components/contentWrap";
import "./index.scss";
const { Column } = Table;

class PowerManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditDialog: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "powerManage/queryResource",
    });
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "powerManage/queryRole",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.powerManage;
    dispatch({
      type: "powerManage/save",
      paylaod: {
        pagination: {
          ...pagination,
          current,
          size,
        },
      },
    });
  };

  handleAdd = (msg = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: "powerManage/save",
      payload: {
        showEditDialog: true,
        currentMsg: { ...msg },
        dialogTitle: "新增",
      },
    });
  };

  handleChangeStatus = (msg, type) => {
    const { dispatch } = this.props;
    dispatch({
      type: "powerManage/save",
      payload: {
        deleteDialog: true,
        currentMsg: { ...msg },
        roleType: type,
      },
    });
  };

  handleEdit = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "powerManage/save",
      payload: {
        showEditDialog: true,
        currentMsg: { ...msg },
        dialogTitle: "编辑",
      },
    });
  };

  handleCloseDeleteDialog = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "powerManage/save",
      payload: {
        deleteDialog: false,
      },
    });
  };

  handleSave = (values) => {
    const { dispatch } = this.props;
    const { dialogTitle } = this.props.powerManage;
    if (dialogTitle === "编辑") {
      dispatch({
        type: "powerManage/updateRole",
        payload: { ...values },
      });
    } else {
      dispatch({
        type: "powerManage/saveRole",
        payload: { ...values },
      });
    }
  };

  render() {
    const { dispatch } = this.props;
    const {
      showEditDialog,
      pagination,
      dialogTitle,
      currentMsg,
      resourceList,
      loading,
      data,
      deleteDialog,
      roleType,
    } = this.props.powerManage;
    const { current, size, total } = pagination;
    return (
      <ContentBox loading={loading}>
        <div className="opreation-bar">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={this.handleAdd}
          >
            新增
          </Button>
        </div>
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
          <Column title="职位名称" dataIndex="roleName" />
          <Column title="职位备注" dataIndex="roleRemark" />
          <Column title="更新时间" dataIndex="updateTime" />
          <Column
            title="操作"
            dataIndex="name"
            width={160}
            render={(value, record, index) => (
              <Space size="middle">
                <a onClick={() => this.handleEdit(record)}>编辑</a>
                <a onClick={() => this.handleChangeStatus(record, "status")}>
                  {record.isDeleted ? "启用" : "停用"}
                </a>
                <a onClick={() => this.handleChangeStatus(record, "delete")}>
                  删除
                </a>
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
                if (roleType === "delete") {
                  dispatch({
                    type: "powerManage/deleteRole",
                  });
                }
                if (roleType === "status") {
                  dispatch({
                    type: "powerManage/changeRoleStatus",
                  });
                }
              }}
            >
              确定
            </Button>,
          ]}
          maskClosable={false}
        >
          你确定要
          {roleType === "delete"
            ? "删除"
            : currentMsg.isDelete
            ? "启用"
            : "停用"}{" "}
          {currentMsg.name} 这个科室吗？
        </Modal>

        {showEditDialog && (
          <EditDialog
            title={dialogTitle}
            data={currentMsg}
            sourceList={{ resourceList }}
            onClosed={() => {
              dispatch({
                type: "powerManage/save",
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

export default connect(({ powerManage }) => ({
  powerManage,
}))(PowerManage);
