import React from "react";
import { connect } from "dva";
import { Table, Button, Space, Modal, Input } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import EditDialog from "./editDialog";
import ContentBox from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";
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

  handleClick = (key) => {
    const { dispatch } = this.props;
    if (key === "add") {
      dispatch({
        type: "hospitalManage/save",
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

  filterChange = (value, key) => {
    const { dispatch } = this.props;
    dispatch({
      type: "hospitalManage/save",
      payload: {
        [key]: value,
      },
    });
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
      condition,
    } = this.props.hospitalManage;
    const { current, size, total } = pagination;
    return (
      <ContentBox loading={loading}>
        <OpreationBar
          total={false}
          custom={
            <>
              <div
                style={{ width: 260, display: "inline-block", marginRight: 15 }}
              >
                <Input
                  style={{ width: 225 }}
                  placeholder="输入医院名称"
                  value={condition}
                  onChange={(e) =>
                    this.filterChange(e.target.value, "condition")
                  }
                  allowClear
                />
                <Button
                  style={{ position: "relative", left: "-3px", top: "1px" }}
                  onClick={this.getTableList}
                  icon={<SearchOutlined />}
                />
              </div>
            </>
          }
        />
        <OpreationBar
          buttonList={[{ key: "add", label: "新增", icon: <PlusOutlined /> }]}
          linkList={[
            {
              key: "export",
              label: "导出",
              icon: <ExportOutlined />,
              params: { condition },
              url: "/hospital/export",
            },
          ]}
          total={total}
          onClick={this.handleClick}
        />
        <Table
          bordered
          rowKey={(record, index) => index}
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
          <Column title="医院名称" dataIndex="name" width={260} />
          <Column title="科室" dataIndex="departmentName" width={100} />
          <Column title="城市" dataIndex="cityName" width={180} />
          <Column title="地址" dataIndex="address" width={160} />
          <Column title="联系人" dataIndex="person" width={100} />
          <Column title="联系电话" dataIndex="phone" width={120} />
          <Column
            title="操作"
            dataIndex="name"
            fixed="right"
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
