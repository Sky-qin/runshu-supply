import React from "react";
import { connect } from "dva";
import { Table, Button, Space, Modal, Input, Select } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import EditDialog from "./editDialog";
import DetailDialog from "./detailDialog";
import ContentBox from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";
import "./index.scss";
const { Column } = Table;

class SupplyRelation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditDialog: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "supplyRelationModel/supplyList" });
    dispatch({ type: "supplyRelationModel/customerList" });
    dispatch({ type: "supplyRelationModel/relationAgencyList" });
    dispatch({ type: "supplyRelationModel/listCategoryDirectory" });

    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "supplyRelationModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.supplyRelationModel;
    dispatch({
      type: "supplyRelationModel/save",
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
    const { dispatch, history } = this.props;
    if (key === "add") {
      dispatch({
        type: "supplyRelationModel/save",
        payload: {
          showEditDialog: true,
          currentMsg: {},
          dialogTitle: "新增",
        },
      });
    }
    if (
      key === "supplyCompanyManage" ||
      key === "agentManage" ||
      key === "customerManage"
    ) {
      dispatch({ type: "entryModel/save", payload: { activeKey: key } });
      history.push(`/entry/${key}`);
    }
  };

  handleEdit = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "supplyRelationModel/supplyRelationDetail",
      payload: { id: msg.id },
    });
  };

  handleShowPrice = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "supplyRelationModel/save",
      payload: {
        showDetailDialog: true,
        currentMsg: { ...msg },
        refId: msg.planRefId,
        relationName: msg.supportProductRef,
      },
    });
  };

  getDetailList = (node, keyword) => {
    const { parentNode, key } = node;
    const { dispatch, supplyRelationModel } = this.props;

    if (parentNode) {
      dispatch({
        type: "supplyRelationModel/save",
        payload: {
          detailList: [],
        },
      });
    } else {
      const values = key.split("-");
      const { refId } = supplyRelationModel;
      dispatch({
        type: "supplyRelationModel/productPriceDetailList",
        payload: {
          refId,
          parentCategoryCode: values[0],
          productCategory: values[2],
          keyword,
        },
      });
    }
  };

  handleSwitch = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "supplyRelationModel/save",
      payload: {
        switchDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  handleCloseSwitchDialog = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "supplyRelationModel/save",
      payload: {
        switchDialog: false,
        dialogBtnLoading: false,
      },
    });
  };

  handleSave = (values) => {
    const { dispatch } = this.props;
    const { dialogTitle, currentMsg } = this.props.supplyRelationModel;
    if (dialogTitle === "编辑") {
      dispatch({
        type: "supplyRelationModel/supplyRelationSave",
        payload: { ...values, id: currentMsg.id },
      });
    } else {
      dispatch({
        type: "supplyRelationModel/supplyRelationSave",
        payload: { ...values },
      });
    }
  };

  filterChange = (value, key) => {
    const { dispatch } = this.props;
    dispatch({
      type: "supplyRelationModel/save",
      payload: {
        [key]: value,
      },
    });
    if (key === "keyword") return;
    this.getTableList();
  };

  render() {
    const { dispatch } = this.props;
    const {
      showEditDialog,
      pagination,
      dialogTitle,
      currentMsg,
      supplyList,
      loading,
      data,
      switchDialog,
      dialogBtnLoading,
      keyword,
      customerList,
      agencyList,
      showDetailDialog,
      detailList,
      categoryTree,
      relationName,
      drawerLoading,
      isEnable,
    } = this.props.supplyRelationModel;
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
                  placeholder="输入供货公司名称"
                  value={keyword}
                  onChange={(e) => this.filterChange(e.target.value, "keyword")}
                  allowClear
                />
                <Button
                  style={{ position: "relative", left: "-3px", top: "1px" }}
                  onClick={this.getTableList}
                  icon={<SearchOutlined />}
                />
              </div>
              <Select
                placeholder="请选择启用、停用状态"
                allowClear={true}
                value={isEnable}
                onChange={(value) => this.filterChange(value, "isEnable")}
                style={{ width: 260, marginRight: 15 }}
                options={[
                  { value: false, label: "停用" },
                  { value: true, label: "启用" },
                ]}
              />
            </>
          }
        />
        <OpreationBar
          buttonList={[
            { key: "add", label: "新增", icon: <PlusOutlined /> },
            { key: "supplyCompanyManage", label: "供货公司管理" },
            { key: "agentManage", label: "代理商管理" },
            { key: "customerManage", label: "客户管理" },
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
          <Column title="供货关系" dataIndex="supportProductRef" width={260} />
          <Column title="供货公司" dataIndex="supplyCompany" width={180} />
          <Column title="代理公司" dataIndex="agencyCompany" width={180} />
          <Column title="客户名称" dataIndex="customer" width={180} />
          <Column
            title="供货价格方案"
            dataIndex="planRefId"
            width={180}
            render={(value, record, index) => (
              <Space size="middle">
                {value && (
                  <a onClick={() => this.handleShowPrice(record)}>查看价格</a>
                )}
              </Space>
            )}
          />
          <Column title="创建时间" dataIndex="createTime" width={180} />
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

        {/* 启用\停用弹窗 */}
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
                  type: "supplyRelationModel/supplyRelationSetEnable",
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
            sourceList={{ supplyList, customerList, agencyList }}
            onClosed={() => {
              dispatch({
                type: "supplyRelationModel/save",
                payload: {
                  showEditDialog: false,
                  dialogBtnLoading: false,
                },
              });
            }}
            onOk={this.handleSave}
          />
        )}

        {showDetailDialog && (
          <DetailDialog
            onChangeList={this.changePrice}
            changeCategory={this.getDetailList}
            onSubmit={this.handleSubmit}
            data={{
              detailList,
              categoryTree,
              relationName,
              drawerLoading,
            }}
            onClosed={() => {
              dispatch({
                type: "supplyRelationModel/save",
                payload: {
                  showDetailDialog: false,
                  detailList: [],
                },
              });
              this.getTableList();
            }}
          />
        )}
      </ContentBox>
    );
  }
}

export default connect(({ supplyRelationModel }) => ({
  supplyRelationModel,
}))(SupplyRelation);
