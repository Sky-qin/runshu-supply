import React from "react";
import { connect } from "dva";
import {
  Space,
  Table,
  Select,
  Input,
  TreeSelect,
  Form,
  Button,
  Row,
  Col,
} from "antd";
import FeedbackDialog from "../../../components/feedbackDialog";
import ContentWrap from "../../../components/contentWrap";
import { OpreationBar } from "wrapd";

import "./index.scss";

const { Column } = Table;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

const tailLayout = {
  wrapperCol: {
    span: 24,
  },
};

class FeedbackInfoManage extends React.Component {
  searchRef = React.createRef();
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
    let { current: searchForm } = this.searchRef;
    const { searchParams, pagination } = this.props.feedbackModel;
    let tmpParams = { searchParams: { ...searchParams, [key]: value } };
    // 获取科室
    if (key === "hospitalId") {
      tmpParams = {
        searchParams: { ...tmpParams.searchParams, departmentId: null },
      };
      searchForm.setFieldsValue({
        departmentId: null,
      });
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
  };

  closeFeedback = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "feedbackModel/save",
      payload: {
        feedbackDialog: false,
      },
    });
    this.getTableList();
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

  onFinish = (values) => {
    this.getTableList();
  };

  onReset = () => {
    let { current: searchForm } = this.searchRef;
    const { dispatch } = this.props;
    searchForm.resetFields();
    dispatch({
      type: "feedbackModel/save",
      payload: {
        searchParams: {},
        departmentList: [],
      },
    });
    this.getTableList();
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: "feedbackModel/save",
      payload: {
        searchParams: {},
        departmentList: [],
      },
    });
  }

  render() {
    const { dispatch } = this.props;
    const {
      pagination,
      data,
      loading,
      hospitalList,
      applicantList,
      feedbackStatusList,
      departmentList,
      feedbackInfo,
      feedbackDialog,
      searchParams,
    } = this.props.feedbackModel;
    const { current, size, total } = pagination;
    return (
      <div>
        <ContentWrap>
          <Form
            {...layout}
            ref={this.searchRef}
            onFinish={this.onFinish}
            style={{ marginTop: "24px" }}
          >
            <Row>
              <Col span={6}>
                <Form.Item label="医院" name="hospitalId">
                  <Select
                    onChange={(value) =>
                      this.onSearchChange("hospitalId", value)
                    }
                    options={hospitalList}
                    placeholder="请选择医院"
                    dropdownMatchSelectWidth={false}
                    showSearch
                    optionFilterProp="label"
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="科室" name="departmentId">
                  <TreeSelect
                    filterTreeNode
                    treeNodeFilterProp="label"
                    placeholder="请选择科室"
                    treeData={departmentList}
                    allowClear
                    disabled={!searchParams.hospitalId}
                    onChange={(value) =>
                      this.onSearchChange("departmentId", value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="状态" name="feedbackStatus">
                  <Select
                    placeholder="请选择状态"
                    options={feedbackStatusList}
                    onChange={(value) =>
                      this.onSearchChange("feedbackStatus", value)
                    }
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="提交人" name="creator">
                  <Select
                    showSearch
                    optionFilterProp="label"
                    placeholder="请选择提交人"
                    options={applicantList}
                    onChange={(value) => this.onSearchChange("creator", value)}
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item label="消耗单号" name="consumeName">
                  <Input
                    placeholder="请输入消耗单号"
                    onChange={(e) =>
                      this.onSearchChange("consumeName", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col
                span={24}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Form.Item style={{ width: "180px" }} {...tailLayout}>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button
                    style={{ marginLeft: "12px" }}
                    htmlType="button"
                    onClick={this.onReset}
                  >
                    重置
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ContentWrap>
        <ContentWrap loading={loading}>
          <OpreationBar total={total} />
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
            <Column
              title="处理时间"
              dataIndex="feedbackUpdateTime"
              width={135}
            />
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
      </div>
    );
  }
}

export default connect(({ feedbackModel }) => ({
  feedbackModel,
}))(FeedbackInfoManage);
