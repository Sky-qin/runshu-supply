import React from "react";
import { connect } from "dva";
import { Button, Space, Table, Modal, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import EditDialog from "./editDialog";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";
import "./index.scss";

const { Column } = Table;
const { Search } = Input;

class RecentWarn extends React.Component {
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
      type: "recentWarnModel/getTableList",
    });
  };

  handleClick = (key) => {
    const { dispatch } = this.props;
    if (key === "add") {
      dispatch({
        type: "recentWarnModel/save",
        payload: {
          showEditDialog: true,
          currentMsg: {},
          dialogTitle: "新增",
          productList: [],
        },
      });
    }
  };

  handleEdit = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "recentWarnModel/save",
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
      type: "recentWarnModel/save",
      payload: {
        deleteDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  handleSave = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: "recentWarnModel/setWarning",
      payload: { ...values },
    });
    // if (dialogTitle === "编辑") {
    //   dispatch({
    //     type: "recentWarnModel/setWarning",
    //     payload: { ...values },
    //   });
    // } else {
    //   dispatch({
    //     type: "recentWarnModel/setWarning",
    //     payload: { ...values },
    //   });
    // }
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.recentWarnModel;
    dispatch({
      type: "recentWarnModel/save",
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
      type: "recentWarnModel/save",
      payload: {
        deleteDialog: false,
        dialogBtnLoading: false,
      },
    });
  };

  onSearchList = (keyword, key) => {
    const { dispatch } = this.props;
    if (key === "product") {
      dispatch({
        type: "recentWarnModel/findProductByWarning",
        payload: {
          keyWord: keyword,
        },
      });
    }
  };

  filterChange = (value, key) => {
    const { dispatch } = this.props;
    dispatch({
      type: "recentWarnModel/save",
      payload: {
        [key]: value,
      },
    });
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
      criticalType,
      productList,
    } = this.props.recentWarnModel;
    const { current, size, total } = pagination;
    return (
      <ContentWrap loading={loading}>
        <OpreationBar
          total={false}
          custom={
            <>
              <Search
                placeholder="输入产品名称/编码"
                onSearch={(value) => this.filterChange(value, "keyWord")}
                style={{ width: 260 }}
              />
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
          <Column title="产品编码" dataIndex="productCode" />
          <Column title="产品名称" dataIndex="productName" />
          <Column title="规格" dataIndex="model" />
          <Column title="生产厂家" dataIndex="productVerdor" />
          <Column title="近效期预警值" dataIndex="periodValue" />
          <Column
            title="操作"
            dataIndex="name"
            width={120}
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
                  type: "recentWarnModel/deleteWarning",
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
            sourceList={{ criticalType, productList }}
            loading={dialogBtnLoading}
            onSearch={this.onSearchList}
            onClosed={() => {
              dispatch({
                type: "recentWarnModel/save",
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

export default connect(({ recentWarnModel }) => ({
  recentWarnModel,
}))(RecentWarn);
