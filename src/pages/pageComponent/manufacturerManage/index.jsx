import React from "react";
import { connect } from "dva";
import { Table, Input, Button, Space } from "antd";
import {
  SearchOutlined,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Prefix } from "../../../utils/config";
import { OpreationBar, ContentBox } from "wrapd";
import RetrunAffix from "../../../components/RetrunAffix";
import EditDialog from "./editDialog";

const { Column } = Table;
class ManufacturerManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "manufacturerManageModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.manufacturerManageModel;
    dispatch({
      type: "manufacturerManageModel/save",
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
    const { pagination } = this.props.manufacturerManageModel;
    dispatch({
      type: "manufacturerManageModel/save",
      payload: {
        [key]: value,
        pagination: {
          ...pagination,
          current: 1,
        },
      },
    });
    if (key === "keyword") return;

    this.getTableList();
  };

  handleEdit = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "manufacturerManageModel/save",
      payload: {
        showEditDialog: true,
        currentMsg: { ...msg },
        dialogTitle: "编辑",
      },
    });
  };

  handleClick = (key) => {
    const { dispatch } = this.props;
    if (key === "add") {
      dispatch({
        type: "manufacturerManageModel/save",
        payload: {
          showEditDialog: true,
          currentMsg: {},
          dialogTitle: "新增",
        },
      });
    }
  };

  handleSave = (values) => {
    const { dispatch } = this.props;
    const { currentMsg } = this.props.manufacturerManageModel;
    dispatch({
      type: "manufacturerManageModel/supplyVendorSave",
      payload: { ...values, id: currentMsg.id },
    });
  };

  render() {
    const { dispatch } = this.props;
    const {
      pagination,
      data,
      loading,
      keyword,
      showEditDialog,
      currentMsg,
      dialogBtnLoading,
      dialogTitle,
    } = this.props.manufacturerManageModel;
    const { current, size, total } = pagination;
    return (
      <ContentBox loading={loading} extend={<RetrunAffix {...this.props} />}>
        <OpreationBar
          custom={
            <>
              <div
                style={{ width: 260, display: "inline-block", marginRight: 15 }}
              >
                <Input
                  style={{ width: 225 }}
                  placeholder="输入生产厂家名称"
                  value={keyword}
                  onChange={(e) =>
                    this.onChangeFilter(e.target.value, "keyword")
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
          total={false}
        />
        <OpreationBar
          buttonList={[{ key: "add", label: "新增", icon: <PlusOutlined /> }]}
          linkList={[
            {
              key: "export",
              label: "导出",
              icon: <ExportOutlined />,
              params: { keyword },
              url: `${Prefix}/supply/vendor/export`,
            },
          ]}
          onClick={this.handleClick}
          total={total}
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
          {/* <Column title="生产厂家编码" dataIndex="vendorCode" /> */}
          <Column title="生产厂家名称" dataIndex="vendorName" />
          <Column title="联系人" dataIndex="contact" />
          <Column title="联系方式" dataIndex="phone" />
          <Column
            title="操作"
            dataIndex="isEnable"
            fixed="right"
            width={110}
            render={(value, record, index) => (
              <Space size="middle">
                <a onClick={() => this.handleEdit(record)}>编辑</a>
                {/* <a onClick={() => this.handleSwitch(record)}>
                  {value ? "停用" : "启用"}
                </a> */}
              </Space>
            )}
          />
        </Table>
        {showEditDialog && (
          <EditDialog
            title={dialogTitle}
            data={currentMsg}
            loading={dialogBtnLoading}
            onClosed={() => {
              dispatch({
                type: "manufacturerManageModel/save",
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

export default connect(({ manufacturerManageModel }) => ({
  manufacturerManageModel,
}))(ManufacturerManage);
