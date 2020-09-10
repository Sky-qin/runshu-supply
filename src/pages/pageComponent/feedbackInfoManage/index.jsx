import React from "react";
import { connect } from "dva";
import { Space, Table, Select, Input, TreeSelect } from "antd";
import styled from "styled-components";
import FeedbackDialog from "../../../components/feedbackDialog";
import ContentWrap from "../../../components/contentWrap";
import "./index.scss";

const { Column } = Table;
const { Search } = Input;

const WrapSelect = styled(Select)`
  width: 160px;
  margin-right: 12px;
`;

class FeedbackInfoManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "feedbackModel/getApplicant",
    });
    dispatch({
      type: "feedbackModel/getHospital",
    });
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "feedbackModel/getFeedbackList",
    });
  };

  handleAdd = (msg = {}, type) => {
    const { dispatch } = this.props;
    const currentMsg = type === "children" ? { id: msg.id } : {};
    dispatch({
      type: "feedbackModel/save",
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
      type: "feedbackModel/save",
      payload: {
        clickStatus: status,
        statusTitle: text,
        showStatusDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  handleDelete = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "feedbackModel/save",
      payload: {
        deleteDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  handleSave = (values) => {
    const { dispatch } = this.props;
    const { dialogTitle } = this.props.feedbackModel;
    if (dialogTitle === "编辑") {
      dispatch({
        type: "feedbackModel/editDepartment",
        payload: { ...values },
      });
    } else {
      dispatch({
        type: "feedbackModel/addDepartment",
        payload: { ...values },
      });
    }
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.feedbackModel;
    dispatch({
      type: "feedbackModel/save",
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
      type: "feedbackModel/save",
      payload: {
        showStatusDialog: false,
      },
    });
  };

  onSearchChange = (key, value) => {
    const { dispatch } = this.props;
    const { searchParams, pagination } = this.props.feedbackModel;
    let tmpParams = { searchParams: { ...searchParams, [key]: value } };
    // 获取科室
    if (key === "hospitalId") {
      tmpParams = {
        searchParams: { ...tmpParams.searchParams, departmentId: null },
      };
      if (value) {
        dispatch({
          type: "feedbackModel/getDePartmentByHsp",
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
      type: "feedbackModel/save",
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
      type: "feedbackModel/save",
      payload: {
        feedbackDialog: false,
      },
    });
  };

  showFeedback = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "feedbackModel/save",
      payload: {
        currentMsg: { ...msg },
      },
    });

    dispatch({ type: "feedbackModel/getFeedbackDetail" });
  };

  render() {
    const { dispatch } = this.props;
    const {
      pagination,
      data,
      loading,
      hospitalList,
      applicantList,
      orderStatusList,
      departmentList,
      feedbackInfo,
      feedbackDialog,
      searchParams,
    } = this.props.feedbackModel;
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
            style={{ width: "160px", marginRight: "12px" }}
            filterTreeNode
            treeNodeFilterProp="label"
            placeholder="请选择科室"
            treeData={departmentList}
            allowClear
            value={searchParams.departmentId || null}
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
            style={{ width: 200 }}
            value={searchParams.consumeName || null}
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
          <Column
            title="序号"
            render={(value, record, index) => index + 1}
            width={60}
          />
          <Column title="消耗单号" dataIndex="consumeNumber" width={120} />
          <Column title="反馈内容" dataIndex="remark" width={200} />
          <Column title="提交人" dataIndex="userName" width={100} />
          <Column title="提交时间" dataIndex="feedbackTime" width={135} />
          <Column title="处理人" dataIndex="feedUserName" width={100} />
          <Column title="处理时间" dataIndex="feedbackUpdateTime" width={135} />
          <Column title="状态" dataIndex="feedbackStatusDesc" width={100} />
          <Column
            title="操作"
            dataIndex="name"
            width={180}
            fixed="right"
            render={(value, record) => {
              return (
                <Space size="middle">
                  <a onClick={() => this.showFeedback(record)}>查看反馈</a>
                </Space>
              );
            }}
          />
        </Table>

        {feedbackDialog && (
          <FeedbackDialog
            data={feedbackInfo}
            onClose={this.closeFeedback}
            onChange={(status) => {
              dispatch({
                type: "feedbackModel/updateFeedbackStatus",
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

export default connect(({ feedbackModel }) => ({
  feedbackModel,
}))(FeedbackInfoManage);
