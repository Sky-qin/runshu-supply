import React from "react";
import { connect } from "dva";
import { Table, Button, Space, Modal, Input } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import AddDialog from "./addDialog";
import DetailDialog from "./detailDialog";
import ContentBox from "../../../components/contentWrap";
import { OpreationBar } from "wrapd";
import "./index.scss";
const { Column } = Table;

class SupplyPriceManage extends React.Component {
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
      type: "supplyPriceManageModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.supplyPriceManageModel;
    dispatch({
      type: "supplyPriceManageModel/save",
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
      dispatch({ type: "supplyPriceManageModel/unSetPriceBizRelationList" });
      dispatch({ type: "supplyPriceManageModel/setPricePlanList" });
      dispatch({
        type: "supplyPriceManageModel/save",
        payload: {
          showAddDialog: true,
          currentMsg: {},
          dialogTitle: "新增价格方案",
        },
      });
    }
  };

  handleEdit = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "supplyPriceManageModel/save",
      payload: {
        showDetailDialog: true,
        currentMsg: { ...msg },
        refId: msg.refId,
        relationName: msg.bizRelationName,
        dialogTitle: "编辑",
      },
    });

    dispatch({
      type: "supplyPriceManageModel/listCategoryDirectory",
    });
  };

  handleDelete = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "supplyPriceManageModel/save",
      payload: {
        deleteDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  handleCloseDeleteDialog = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "supplyPriceManageModel/save",
      payload: {
        deleteDialog: false,
        dialogBtnLoading: false,
      },
    });
  };

  handleSave = (values) => {
    const { relationName, ...others } = values;
    const { dispatch } = this.props;
    dispatch({
      type: "supplyPriceManageModel/save",
      payload: { relationName },
    });
    dispatch({
      type: "supplyPriceManageModel/initProductPrice",
      payload: { ...others },
    });
  };

  filterChange = (value, key) => {
    const { dispatch } = this.props;
    dispatch({
      type: "supplyPriceManageModel/save",
      payload: {
        [key]: value,
      },
    });
  };

  changePrice = (list) => {
    const { dispatch } = this.props;
    dispatch({
      type: "supplyPriceManageModel/save",
      payload: {
        detailList: list,
      },
    });
  };

  handleSavePrice = (record, key, callBack) => {
    const { dispatch } = this.props;
    const { refId } = this.props.supplyPriceManageModel;
    const { detailId, itemId, price, winCompCode } = record;
    dispatch({
      type: "supplyPriceManageModel/productPriceSave",
      payload: {
        refId,
        detailId,
        itemId,
        price,
        winCompCode,
        callBack,
      },
    });
  };

  getDetailList = (node, keyword, current, size) => {
    const { parentNode, key, level } = node;
    const { dispatch, supplyPriceManageModel } = this.props;
    const { dialogCurrent, dialogSize } = supplyPriceManageModel;
    dispatch({
      type: "supplyPriceManageModel/save",
      payload: {
        dialogCurrent: current || dialogCurrent,
        dialogSize: size || dialogSize,
        dialogTotal: 0,
      },
    });

    if (parentNode) {
      dispatch({
        type: "supplyPriceManageModel/save",
        payload: {
          detailList: [],
        },
      });
    } else {
      const { refId } = supplyPriceManageModel;
      dispatch({
        type: "supplyPriceManageModel/productPriceDetailList",
        payload: {
          refId,
          keyword,
          category: {
            level,
            categoryCode: key,
          },
        },
      });
    }
  };

  render() {
    const { dispatch } = this.props;
    const {
      showAddDialog,
      showDetailDialog,
      pagination,
      dialogTitle,
      loading,
      data,
      deleteDialog,
      dialogBtnLoading,
      keyword,
      drawerLoading,
      categoryTree,
      detailList,
      relationList,
      planList,
      relationName,
      dialogSize,
      dialogCurrent,
      dialogTotal,
    } = this.props.supplyPriceManageModel;
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
                  placeholder="输入客户名称"
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
            </>
          }
        />
        <OpreationBar
          buttonList={[
            { key: "add", label: "新增价格方案", icon: <PlusOutlined /> },
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
          <Column title="供货关系" dataIndex="bizRelationName" width={260} />
          <Column
            title="已设置价格数量"
            dataIndex="priceProductNumber"
            width={120}
            render={(value, record) => {
              const { priceProductNumber, onsaleNumber } = record;
              return `${priceProductNumber}/${onsaleNumber}`;
            }}
          />
          <Column title="创建人" dataIndex="creatorName" width={160} />
          <Column title="创建时间" dataIndex="createTime" width={100} />
          <Column title="更新人" dataIndex="modifierName" width={100} />
          <Column title="更新时间" dataIndex="updateTime" width={180} />
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
                dispatch({ type: "supplyPriceManageModel/productPriceDelete" });
              }}
            >
              确定
            </Button>,
          ]}
          maskClosable={false}
        >
          你确定要删除吗？
        </Modal>

        {showAddDialog && (
          <AddDialog
            title={dialogTitle}
            loading={dialogBtnLoading}
            sourceList={{
              relationList,
              planList,
            }}
            onClosed={() => {
              dispatch({
                type: "supplyPriceManageModel/save",
                payload: {
                  showAddDialog: false,
                  dialogBtnLoading: false,
                },
              });
            }}
            onOk={this.handleSave}
          />
        )}
        {/* showDetailDialog */}
        {showDetailDialog && (
          <DetailDialog
            title="价格编辑预览"
            onChangeList={this.changePrice}
            onSavePrice={this.handleSavePrice}
            changeCategory={this.getDetailList}
            onSubmit={this.handleSubmit}
            data={{
              drawerLoading,
              detailList,
              categoryTree,
              relationName,
              dialogSize,
              dialogCurrent,
              dialogTotal,
            }}
            onClosed={() => {
              dispatch({
                type: "supplyPriceManageModel/save",
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

export default connect(({ supplyPriceManageModel }) => ({
  supplyPriceManageModel,
}))(SupplyPriceManage);
