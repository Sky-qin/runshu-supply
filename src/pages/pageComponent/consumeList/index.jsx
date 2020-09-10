import React from "react";
import { connect } from "dva";
import { Button, Space, Table, Modal, Select, Input, TreeSelect } from "antd";
import styled from "styled-components";
import FeedbackDialog from "../../../components/feedbackDialog";
import EditDialog from "./editDialog";
// import T from "prop-types";
import ContentWrap from "../../../components/contentWrap";
import "./index.scss";

const { Column } = Table;
const { Search } = Input;

const WrapSelect = styled(Select)`
  width: 160px;
  margin-right: 12px;
`;

class ConsumeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "consumeModel/getApplicant",
    });
    dispatch({
      type: "consumeModel/getHospital",
    });
    dispatch({
      type: "consumeModel/getOrderStatus",
    });
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "consumeModel/queryConsumeList",
    });
  };

  handleAdd = (msg = {}, type) => {
    const { dispatch } = this.props;
    const currentMsg = type === "children" ? { id: msg.id } : {};
    dispatch({
      type: "consumeModel/save",
      payload: {
        showDetailDialog: true,
        dialogTitle: "新增科室",
        currentMsg,
      },
    });
  };

  handleEdit = (msg, text, status) => {
    const { dispatch } = this.props;
    dispatch({
      type: "consumeModel/save",
      payload: {
        clickStatus: status,
        statusTitle: text,
        showStatusDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  showDetail = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "consumeModel/save",
      payload: {
        showDetailDialog: true,
        currentMsg: { ...msg },
      },
    });

    dispatch({
      type: "consumeModel/getConsumeDetail",
    });
  };

  handleDelete = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "consumeModel/save",
      payload: {
        deleteDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  handleSave = (values) => {
    const { dispatch } = this.props;
    const { dialogTitle } = this.props.consumeModel;
    if (dialogTitle === "编辑") {
      dispatch({
        type: "consumeModel/editDepartment",
        payload: { ...values },
      });
    } else {
      dispatch({
        type: "consumeModel/addDepartment",
        payload: { ...values },
      });
    }
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.consumeModel;
    dispatch({
      type: "consumeModel/save",
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
      type: "consumeModel/save",
      payload: {
        showStatusDialog: false,
        dialogBtnLoading: false,
      },
    });
  };

  onSearchChange = (key, value) => {
    const { dispatch } = this.props;
    const { searchParams, pagination } = this.props.consumeModel;
    let tmpParams = { searchParams: { ...searchParams, [key]: value } };
    // 获取科室
    if (key === "hospitalId") {
      tmpParams = {
        searchParams: { ...tmpParams.searchParams, departmentId: null },
      };
      if (value) {
        dispatch({
          type: "consumeModel/getDePartmentByHsp",
          payload: {
            id: value,
          },
        });
      } else {
        tmpParams = {
          ...tmpParams,
          departmentList: [],
        };
      }
    }
    dispatch({
      type: "consumeModel/save",
      payload: {
        ...tmpParams,
        pagination: {
          ...pagination,
          current: 1,
        },
      },
    });
    this.getTableList();
  };

  closeFeedback = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "consumeModel/save",
      payload: {
        feedbackDialog: false,
      },
    });
  };

  showFeedback = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "consumeModel/save",
      payload: {
        currentMsg: { ...msg },
      },
    });

    dispatch({ type: "consumeModel/getFeedbackDetail" });
  };

  render() {
    const { dispatch } = this.props;
    const {
      showStatusDialog,
      pagination,
      data,
      loading,
      hospitalList,
      applicantList,
      orderStatusList,
      departmentList,
      statusTitle,
      feedbackInfo,
      feedbackDialog,
      searchParams,
      dialogBtnLoading,
    } = this.props.consumeModel;
    const { current, size, total } = pagination;
    return (
      <ContentWrap loading={loading}>
        <div className="opreation-bar">
          <WrapSelect
            onChange={(value) => this.onSearchChange("hospitalId", value)}
            options={hospitalList}
            placeholder="请选择医院"
            value={searchParams.hospitalId || null}
            allowClear
          />
          <TreeSelect
            // treeDataSimpleMode
            allowClear
            style={{ width: "160px", marginRight: "12px" }}
            filterTreeNode
            treeNodeFilterProp="label"
            placeholder="请选择科室"
            value={searchParams.departmentId}
            treeData={departmentList}
            onChange={(value) => this.onSearchChange("departmentId", value)}
          />
          <WrapSelect
            placeholder="请选择状态"
            options={orderStatusList}
            onChange={(value) => this.onSearchChange("orderStatus", value)}
            value={searchParams.orderStatus || null}
          />
          <WrapSelect
            placeholder="请选择申请人"
            options={applicantList}
            onChange={(value) => this.onSearchChange("creator", value)}
            value={searchParams.creator || null}
          />
          <Search
            placeholder="请输入消耗单号"
            onSearch={(value) => this.onSearchChange("consumeName", value)}
            value={searchParams.consumeName || null}
            style={{ width: 200 }}
          />
        </div>
        <div className="opreation-bar"></div>
        <Table
          bordered
          rowKey={(record, index) => index}
          dataSource={data}
          scroll={{ x: 1500 }}
          pagination={{
            position: ["bottomCenter"],
            current: current,
            total: total || 0,
            pageSize: size,
            onChange: this.changePagination,
            onShowSizeChange: this.changePagination,
          }}
        >
          <Column title="消耗单号" dataIndex="consumeNumber" width={120} />
          <Column title="医院" dataIndex="hispitalName" width={130} />
          <Column title="科室" dataIndex="departmentName" width={120} />
          <Column title="申请人" dataIndex="userName" width={100} />
          <Column title="申请时间" dataIndex="createTime" width={150} />
          <Column title="状态" dataIndex="orderStatusDesc" width={100} />
          <Column title="手术单" dataIndex="" width={120} />
          <Column
            title="操作"
            dataIndex="name"
            width={180}
            fixed="right"
            render={(value, record) => {
              const { orderStatus } = record;
              return (
                <Space size="middle">
                  {orderStatus === 0 && (
                    <a onClick={() => this.handleEdit(record, "确定", "1")}>
                      确认
                    </a>
                  )}
                  {orderStatus === 0 && (
                    <a onClick={() => this.handleEdit(record, "驳回", "2")}>
                      驳回
                    </a>
                  )}
                  {orderStatus === 1 && (
                    <a onClick={() => this.handleEdit(record, "撤销", "0")}>
                      撤销
                    </a>
                  )}
                  {orderStatus === 4 && (
                    <a onClick={() => this.showFeedback(record)}>查看反馈</a>
                  )}
                  <a onClick={() => this.showDetail(record)}>查看详情</a>
                </Space>
              );
            }}
          />
        </Table>

        {/* 删除弹窗 */}
        <Modal
          title="提示"
          visible={showStatusDialog}
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
                  type: "consumeModel/updateConsumeStatus",
                });
              }}
            >
              确定
            </Button>,
          ]}
          maskClosable={false}
        >
          你确定要{` ${statusTitle} `}这个条消耗单吗？
        </Modal>
        {/* 编辑弹窗 */}
        <EditDialog />
        {feedbackDialog && (
          <FeedbackDialog
            data={feedbackInfo}
            onClose={this.closeFeedback}
            onChange={(status) => {
              dispatch({
                type: "consumeModel/updateFeedbackStatus",
                payload: {
                  status,
                },
              });
            }}
          />
        )}
      </ContentWrap>
    );
  }
}

export default connect(({ consumeModel }) => ({
  consumeModel,
}))(ConsumeList);
