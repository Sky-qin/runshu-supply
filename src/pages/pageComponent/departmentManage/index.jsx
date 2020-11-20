import React from "react";
import { connect } from "dva";
import { Button, Space, Table, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import EditDialog from "./editDialog";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";
import "./index.scss";

const { Column } = Table;

class Test extends React.Component {
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
      type: "departmentManage/queryDepartment",
    });
  };

  handleAdd = (msg = {}, type) => {
    const { dispatch } = this.props;
    const currentMsg = type === "children" ? { id: msg.id } : {};
    dispatch({
      type: "departmentManage/save",
      payload: {
        showEditDialog: true,
        dialogTitle: "新增科室",
        currentMsg,
      },
    });
  };

  handleClick = (key) => {
    const { dispatch } = this.props;
    if (key === "add") {
      dispatch({
        type: "departmentManage/save",
        payload: {
          showEditDialog: true,
          currentMsg: {},
          dialogTitle: "新增科室",
        },
      });
    }
  };

  handleEdit = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "departmentManage/save",
      payload: {
        showEditDialog: true,
        dialogTitle: "编辑",
        currentMsg: { ...msg },
      },
    });
  };

  handleDelete = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "departmentManage/save",
      payload: {
        deleteDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  handleSave = (values) => {
    const { dispatch } = this.props;
    const { dialogTitle } = this.props.departmentManage;
    if (dialogTitle === "编辑") {
      dispatch({
        type: "departmentManage/editDepartment",
        payload: { ...values },
      });
    } else {
      dispatch({
        type: "departmentManage/addDepartment",
        payload: { ...values },
      });
    }
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.departmentManage;
    dispatch({
      type: "departmentManage/save",
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

  handleCloseDeleteDialog = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "departmentManage/save",
      payload: {
        deleteDialog: false,
        dialogBtnLoading: false,
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
      pagination,
      data,
      loading,
      dialogBtnLoading,
    } = this.props.departmentManage;
    const { current, size, total } = pagination;
    return (
      <ContentWrap loading={loading} props={this.props} hasRetrun={true}>
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
            current: current,
            total: total || 0,
            pageSize: size,
            onChange: this.changePagination,
            onShowSizeChange: this.changePagination,
          }}
        >
          <Column title="科室名称" dataIndex="name" />
          <Column title="创建时间" dataIndex="createTime" />
          <Column title="修改时间" dataIndex="updateTime" />
          <Column
            title="操作"
            dataIndex="name"
            width={200}
            render={(value, record, index) => (
              <Space size="middle">
                {record.pid === "0" && (
                  <a onClick={() => this.handleAdd(record, "children")}>
                    添加子科室
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
              loading={dialogBtnLoading}
              onClick={() => {
                dispatch({
                  type: "departmentManage/deleteDepartment",
                });
              }}
            >
              确定
            </Button>,
          ]}
          maskClosable={false}
        >
          你确定要删除 {currentMsg.name} 这个科室吗？
        </Modal>
        {/* 编辑弹窗 */}
        {showEditDialog && (
          <EditDialog
            title={dialogTitle}
            data={currentMsg}
            loading={dialogBtnLoading}
            onClosed={() => {
              dispatch({
                type: "departmentManage/save",
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

export default connect(({ departmentManage }) => ({
  departmentManage,
}))(Test);
