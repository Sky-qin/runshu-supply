import React from "react";
import { connect } from "dva";
import { Button, Space, Table, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import EditDialog from "./editDialog";
import ContentWrap from "../../../components/contentWrap";
import "./index.scss";

const { Column } = Table;

class MenuConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // this.handleLogin();
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "menuModel/getResourceList",
    });
  };

  handleAdd = (msg = {}, type) => {
    const { dispatch } = this.props;
    const currentMsg =
      type === "children" ? { parentId: msg.id } : { parentId: "0" };
    console.log("currentMsg", currentMsg);
    dispatch({
      type: "menuModel/save",
      payload: {
        type,
        showEditDialog: true,
        dialogTitle: "新增菜单",
        currentMsg,
      },
    });
  };

  handleEdit = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "menuModel/save",
      payload: {
        type: "edit",
        showEditDialog: true,
        dialogTitle: "编辑",
        currentMsg: { ...msg },
      },
    });
  };

  handleDelete = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "menuModel/save",
      payload: {
        deleteDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  handleSave = (values) => {
    const { dispatch } = this.props;
    const { type } = this.props.menuModel;
    if (type === "children" || type === "parent") {
      dispatch({
        type: "menuModel/insertResource",
        payload: { ...values },
      });
    }
    if (type === "edit") {
      dispatch({
        type: "menuModel/updateResource",
        payload: { ...values },
      });
    }
  };

  handleCloseDeleteDialog = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "menuModel/save",
      payload: {
        deleteDialog: false,
      },
    });
  };

  render() {
    const { dispatch } = this.props;
    const {
      showEditDialog,
      dialogTitle,
      currentMsg,
      deleteDialog,
      data,
      loading,
      type,
    } = this.props.menuModel;
    return (
      <ContentWrap loading={loading}>
        <div className="opreation-bar">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => this.handleAdd({}, "parent")}
          >
            新增
          </Button>
        </div>
        <Table
          bordered
          rowKey={(record, index) => index}
          dataSource={data}
          pagination={false}
        >
          <Column title="菜单名称" dataIndex="resourceName" />
          <Column title="菜单标识" dataIndex="resourceSign" />
          <Column title="菜单图标" dataIndex="icon" />
          <Column
            title="操作"
            dataIndex="name"
            width={230}
            render={(value, record, index) => (
              <Space size="middle">
                {record.parentId === "0" && (
                  <a onClick={() => this.handleAdd(record, "children")}>
                    添加二级菜单
                  </a>
                )}
                <a onClick={() => this.handleEdit(record)}>编辑</a>
                {(!record.children || record.children.length === 0) && (
                  <a onClick={() => this.handleDelete(record)}>删除</a>
                )}
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
                  type: "menuModel/deleteResource",
                });
              }}
            >
              确定
            </Button>,
          ]}
          maskClosable={false}
        >
          你确定要删除 {currentMsg.name} 这个菜单吗？
        </Modal>
        {/* 编辑弹窗 */}
        {showEditDialog && (
          <EditDialog
            type={type}
            title={dialogTitle}
            data={currentMsg}
            onClosed={() => {
              dispatch({
                type: "menuModel/save",
                payload: {
                  showEditDialog: false,
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

export default connect(({ menuModel }) => ({
  menuModel,
}))(MenuConfig);
