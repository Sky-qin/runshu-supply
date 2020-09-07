import React, { Children } from "react";
import { connect } from "dva";
import { Button, Space, Table, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import EditDialog from "./editDialog";
// import zhCN from "antd/es/locale/zh_CN";
// import T from "prop-types";
import ContentWrap from "../../../components/contentWrap";
import "./index.scss";

const { Column } = Table;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

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
    } = this.props.departmentManage;
    const { current, size, total } = pagination;
    return (
      <ContentWrap loading={loading}>
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
                {!record.pid && (
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
            onClosed={() => {
              dispatch({
                type: "departmentManage/save",
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

export default connect(({ departmentManage }) => ({
  departmentManage,
}))(Test);
