import React from "react";
import { connect } from "dva";
import { Table, Button, Space, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import EditDialog from "./editDialog";
import ContentBox from "../../../components/contentWrap";
import "./index.scss";
const { Column } = Table;

class HospitalManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditDialog: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "hospitalManage/getAddress",
    });
    dispatch({
      type: "hospitalManage/storageList",
    });
    dispatch({
      type: "hospitalManage/departmentList",
    });
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "hospitalManage/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.hospitalManage;
    dispatch({
      type: "hospitalManage/save",
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

  handleAdd = (msg = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: "hospitalManage/save",
      payload: {
        showEditDialog: true,
        currentMsg: { ...msg },
        dialogTitle: "新增",
      },
    });
  };

  handleEdit = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "hospitalManage/save",
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
      type: "hospitalManage/save",
      payload: {
        deleteDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  handleCloseDeleteDialog = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "hospitalManage/save",
      payload: {
        deleteDialog: false,
        dialogBtnLoading: false,
      },
    });
  };

  handleSave = (values) => {
    const { dispatch } = this.props;
    const { dialogTitle } = this.props.hospitalManage;
    if (dialogTitle === "编辑") {
      dispatch({
        type: "hospitalManage/updateHospital",
        payload: { ...values },
      });
    } else {
      dispatch({
        type: "hospitalManage/saveHospital",
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
      adressList,
      storageList,
      departmentList,
      loading,
      data,
      deleteDialog,
      dialogBtnLoading,
    } = this.props.hospitalManage;
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
          <Column title="医院名称" dataIndex="name" width={180} />
          <Column title="科室" dataIndex="departmentName" width={120} />
          <Column title="城市" dataIndex="cityName" width={180} />
          <Column title="地址" dataIndex="address" width={160} />
          <Column title="联系人" dataIndex="person" width={120} />
          <Column title="联系电话" dataIndex="phone" width={120} />
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
                  type: "hospitalManage/deleteHospital",
                });
              }}
            >
              确定
            </Button>,
          ]}
          maskClosable={false}
        >
          你确定要删除 {currentMsg.name} 这个医院吗？
        </Modal>

        {showEditDialog && (
          <EditDialog
            title={dialogTitle}
            data={currentMsg}
            loading={dialogBtnLoading}
            sourceList={{ adressList, storageList, departmentList }}
            onClosed={() => {
              dispatch({
                type: "hospitalManage/save",
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

export default connect(({ hospitalManage }) => ({
  hospitalManage,
}))(HospitalManage);
