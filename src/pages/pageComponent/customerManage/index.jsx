import React from "react";
import { connect } from "dva";
import { Table, Input, Button, Space } from "antd";
import {
  SearchOutlined,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import EditDialog from "./editDialog";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";

const { Column } = Table;
class CustomerManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "customerManageModel/getHospital" });

    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "customerManageModel/getTableList",
    });
  };

  handleClick = (key) => {
    const { dispatch } = this.props;
    if (key === "add") {
      dispatch({
        type: "customerManageModel/save",
        payload: {
          showEditDialog: true,
          currentMsg: {},
          dialogTitle: "新增客户",
        },
      });
    }
  };

  handleEdit = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "customerManageModel/save",
      payload: {
        currentMsg: { ...msg },
        showEditDialog: true,
        dialogTitle: "编辑客户",
      },
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.customerManageModel;
    dispatch({
      type: "customerManageModel/save",
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

  onChangeFilter = (value, key) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.customerManageModel;
    dispatch({
      type: "customerManageModel/save",
      payload: {
        [key]: value,
        pagination: {
          ...pagination,
          current: 1,
        },
      },
    });
  };

  render() {
    const { dispatch } = this.props;
    const {
      pagination,
      data,
      loading,
      supplierName,
      showEditDialog,
      dialogTitle,
      currentMsg,
      dialogBtnLoading,
      supplyList,
      customerList,
      agencyList,
      hospitalList,
    } = this.props.customerManageModel;
    const { current, size, total } = pagination;
    return (
      <ContentWrap loading={loading}>
        <OpreationBar
          custom={
            <>
              <div
                style={{ width: 260, display: "inline-block", marginRight: 15 }}
              >
                <Input
                  style={{ width: 225 }}
                  placeholder="输入客户名称"
                  value={supplierName}
                  onChange={(e) =>
                    this.onChangeFilter(e.target.value, "supplierName")
                  }
                  onPressEnter={this.getTableList}
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
          total={false}
        />
        <OpreationBar
          buttonList={[{ key: "add", label: "新增", icon: <PlusOutlined /> }]}
          linkList={[
            {
              key: "export",
              label: "导出",
              icon: <ExportOutlined />,
              params: { supplierName },
              url: "/supply/customer/export",
            },
          ]}
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
          <Column
            title="序号"
            width={80}
            render={(value, record, index) => index + 1}
          />
          <Column title="客户名称" dataIndex="name" />
          <Column title="客户类型" dataIndex="typeDesc" />
          <Column title="关联医院" dataIndex="hospitalName" />
          <Column title="科室" dataIndex="departmentName" />
          <Column title="创建日期" width={120} dataIndex="createTime" />
          <Column
            title="操作"
            dataIndex="isEnable"
            width={120}
            render={(value, record, index) => {
              return (
                <Space size="middle">
                  <a onClick={() => this.handleEdit(record)}>编辑</a>
                  <a onClick={() => this.handleSwitch(record)}>
                    {value ? "停用" : "启用"}
                  </a>
                </Space>
              );
            }}
          />
        </Table>
        {showEditDialog && (
          <EditDialog
            title={dialogTitle}
            data={currentMsg}
            loading={dialogBtnLoading}
            sourceList={{ supplyList, customerList, agencyList, hospitalList }}
            onClosed={() => {
              dispatch({
                type: "customerManageModel/save",
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

export default connect(({ customerManageModel }) => ({
  customerManageModel,
}))(CustomerManage);
