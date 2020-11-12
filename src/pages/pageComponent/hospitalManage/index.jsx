import React from "react";
import { connect } from "dva";
import { Table, Button, Space, Modal, Input, Select } from "antd";
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
    dispatch({ type: "hospitalManage/getAddress" });
    dispatch({ type: "hospitalManage/storageList" });
    dispatch({ type: "hospitalManage/departmentList" });
    dispatch({ type: "hospitalManage/findSalesmanList" });

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

  handleSwitch = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "hospitalManage/save",
      payload: {
        switchDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  handleCloseSwitchDialog = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "hospitalManage/save",
      payload: {
        switchDialog: false,
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
    const { pagination } = this.props.hospitalManage;
    dispatch({
      type: "hospitalManage/save",
      payload: {
        [key]: value,
        pagination: {
          ...pagination,
          current: 1,
        },
      },
    });
    if (key === "condition") return;
    this.getTableList();
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
      switchDialog,
      dialogBtnLoading,
      condition,
      salesmanList,
      userId,
      isEnable,
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
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="请选择业务员"
                value={userId}
                options={salesmanList}
                allowClear
                style={{ width: 260, marginRight: 15 }}
                onChange={(value) => this.filterChange(value, "userId")}
              />
              <Select
                placeholder="请选择合作状态"
                allowClear={true}
                value={isEnable}
                onChange={(value) => this.filterChange(value, "isEnable")}
                style={{ width: 260, marginRight: 15 }}
                options={[
                  { value: true, label: "是" },
                  { value: false, label: "否" },
                ]}
              />
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
          <Column
            title="是否合作"
            dataIndex="isEnable"
            width={100}
            render={(value) => {
              if (value === true) return "是";
              if (value === false) return "否";
            }}
          />
          <Column title="科室" dataIndex="departmentName" width={100} />
          <Column title="城市" dataIndex="cityName" width={180} />
          <Column title="地址" dataIndex="address" width={160} />
          <Column title="联系人" dataIndex="person" width={100} />
          <Column title="联系电话" dataIndex="phone" width={120} />
          <Column title="业务员" dataIndex="salerNames" width={120} />
          <Column
            title="操作"
            dataIndex="isEnable"
            fixed="right"
            width={110}
            render={(value, record, index) => (
              <Space size="middle">
                <a onClick={() => this.handleEdit(record)}>编辑</a>
                <a onClick={() => this.handleSwitch(record)}>
                  {value ? "停用" : "启用"}
                </a>
              </Space>
            )}
          />
        </Table>

        {/* 删除弹窗 */}
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
                  type: "hospitalManage/hospitalUpdateState",
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
