import React from "react";
import { connect } from "dva";
import { Button, Space, Table, Modal, Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import EditDialog from "./editDialog";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";
import "./index.scss";

const { Column } = Table;
const { Search } = Input;

class PicManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "picManageModel/queryProductCategory" });
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "picManageModel/getTableList",
    });
  };

  handleClick = (key) => {
    const { dispatch } = this.props;
    if (key === "add") {
      dispatch({
        type: "picManageModel/save",
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
      type: "picManageModel/save",
      payload: {
        showEditDialog: true,
        dialogTitle: "编辑",
        currentMsg: { ...msg },
        productList: [
          {
            value: msg.productCode,
            label: `${msg.productName}-${msg.productCode}`,
          },
        ],
      },
    });
  };

  handleDelete = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "picManageModel/save",
      payload: {
        deleteDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  handleSave = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: "picManageModel/setWarning",
      payload: { ...values },
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.picManageModel;
    dispatch({
      type: "picManageModel/save",
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
      type: "picManageModel/save",
      payload: {
        deleteDialog: false,
        dialogBtnLoading: false,
      },
    });
  };

  onFormChange = (value, key, callBack) => {
    const { dispatch, picManageModel } = this.props;
    const { currentMsg } = picManageModel;
    let tmp = { [key]: value };
    if (key === "productCategory") {
      dispatch({
        type: "picManageModel/productVendorListbyCategory",
        payload: {
          productCategory: value,
        },
      });
      tmp = { ...tmp, productCode: null, productVendor: null };
      callBack({ productVendor: null });
      callBack({ productCode: null });
    }
    if (key === "productVendor") {
      dispatch({
        type: "picManageModel/productNameList",
        payload: {
          productCategory: currentMsg.productCategory,
          productVendor: value,
        },
      });
      tmp = { ...tmp, productCode: null };
      callBack({ productCode: null });
    }

    dispatch({
      type: "picManageModel/save",
      payload: {
        currentMsg: { ...currentMsg, ...tmp },
      },
    });
  };

  filterChange = (value, key) => {
    const { dispatch } = this.props;
    dispatch({
      type: "picManageModel/save",
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
      dialogTitle,
      currentMsg,
      deleteDialog,
      pagination,
      data,
      loading,
      dialogBtnLoading,
      productList,
      keyword,
      categoryList,
      productVendorList,
      productNameList,
    } = this.props.picManageModel;
    const { current, size, total } = pagination;
    return (
      <ContentWrap loading={loading}>
        <OpreationBar
          total={false}
          custom={
            <>
              <div style={{ width: 260, display: "inline-block" }}>
                <Input
                  style={{ width: 225 }}
                  placeholder="输入产品名称/编码"
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
          buttonList={[{ key: "add", label: "新增", icon: <PlusOutlined /> }]}
          total={total}
          onClick={this.handleClick}
        />
        <Table
          bordered
          rowKey={(record, index) => index}
          dataSource={data}
          scroll={{ x: 1300 }}
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
          <Column
            title="封面图"
            dataIndex="imageUrl"
            width={120}
            render={(value) => {
              return (
                <img
                  width={80}
                  height={80}
                  src={`https://filesystem.runshutech.com/group1/${value}`}
                />
              );
            }}
          />
          <Column title="产品名称" dataIndex="productName" />
          <Column title="产品类别" dataIndex="productCategory" width={120} />
          <Column title="生产厂家" dataIndex="productVerdor" />
          <Column
            title="操作"
            width={120}
            fixed="right"
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
                  type: "picManageModel/deleteWarning",
                });
              }}
            >
              确定
            </Button>,
          ]}
          maskClosable={false}
        >
          你确定要删除该条预警吗？
        </Modal>
        {/* 编辑弹窗 */}
        {showEditDialog && (
          <EditDialog
            title={dialogTitle}
            data={currentMsg}
            sourceList={{ categoryList, productVendorList, productNameList }}
            loading={dialogBtnLoading}
            onFormChange={this.onFormChange}
            onClosed={() => {
              dispatch({
                type: "picManageModel/save",
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

export default connect(({ picManageModel }) => ({
  picManageModel,
}))(PicManage);
