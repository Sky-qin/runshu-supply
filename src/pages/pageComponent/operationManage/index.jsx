import React from "react";
import { connect } from "dva";
import { Table, Button, Space, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import EditDialog from "./editDialog";
import { OpreationBar, ContentBox } from "wrapd";
import RetrunAffix from "../../../components/RetrunAffix";
import "./index.scss";
const { Column } = Table;

class OperationManage extends React.Component {
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
      type: "operationManageModel/queryUser",
    });
  };

  handleClick = (key) => {
    const { dispatch } = this.props;
    if (key === "add") {
      dispatch({
        type: "operationManageModel/save",
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
      type: "operationManageModel/save",
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
      type: "operationManageModel/save",
      payload: {
        deleteDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  handleCloseDeleteDialog = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "operationManageModel/save",
      payload: {
        deleteDialog: false,
      },
    });
  };

  handleSave = (values) => {
    const { dispatch } = this.props;
    const { dialogTitle, currentMsg } = this.props.operationManageModel;
    if (dialogTitle === "编辑") {
      dispatch({
        type: "operationManageModel/operationTypeSave",
        payload: { ...values, id: currentMsg.id },
      });
    } else {
      dispatch({
        type: "operationManageModel/operationTypeSave",
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
      dialogTitle,
      currentMsg,
      loading,
      data,
      total,
    } = this.props.operationManageModel;
    return (
      <ContentBox loading={loading} extend={<RetrunAffix {...this.props} />}>
        <OpreationBar
          buttonList={[{ key: "add", label: "新增", icon: <PlusOutlined /> }]}
          total={total}
          onClick={this.handleClick}
        />
        <Table
          bordered
          rowKey={(record, index) => index}
          dataSource={data}
          pagination={false}
        >
          <Column
            title="序号"
            render={(value, record, index) => index + 1}
            width={65}
          />
          <Column title="手术名称" dataIndex="operationType" />
          <Column title="创建时间" dataIndex="createTime" />
          <Column title="更新时间" dataIndex="updateTime" />
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
                  type: "operationManageModel/operationTypeDelete",
                });
              }}
            >
              确定
            </Button>,
          ]}
          maskClosable={false}
        >
          你确定要删除用户 {currentMsg.operationType} 吗？
        </Modal>

        {showEditDialog && (
          <EditDialog
            title={dialogTitle}
            data={currentMsg}
            onClosed={() => {
              dispatch({
                type: "operationManageModel/save",
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

export default connect(({ operationManageModel }) => ({
  operationManageModel,
}))(OperationManage);
