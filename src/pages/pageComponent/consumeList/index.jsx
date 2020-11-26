import React from "react";
import { connect } from "dva";
import {
  Button,
  Space,
  Table,
  Modal,
  Select,
  Input,
  TreeSelect,
  Form,
  Col,
  Row,
} from "antd";
import DialogCarousel from "../../../components/dialogCarousel";
import FeedbackDialog from "../../../components/feedbackDialog";
import ContentWrap from "../../../components/contentWrap";
import { OpreationBar } from "wrapd";

import EditDialog from "./editDialog";

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

const colorList = { 0: "#f60", 1: "#52c41a", 2: "red", 3: "red" };

class ConsumeList extends React.Component {
  searchRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      showPicList: false,
      picList: [],
    };
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
    let { current: searchForm } = this.searchRef;
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
    // this.getTableList();
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

  handleViewPicList = (list) => {
    this.setState({ picList: list, showPicList: true });
  };

  onFinish = (values) => {
    this.getTableList();
  };

  onReset = () => {
    let { current: searchForm } = this.searchRef;
    const { dispatch } = this.props;
    searchForm.resetFields();
    dispatch({
      type: "consumeModel/save",
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
      type: "consumeModel/save",
      payload: {
        searchParams: {},
        departmentList: [],
      },
    });
  }

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
      dialogBtnLoading,
      searchParams,
    } = this.props.consumeModel;
    const { picList, showPicList } = this.state;
    const { current, size, total } = pagination;
    return (
      <>
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
                    value={searchParams.departmentId}
                    disabled={!searchParams.hospitalId}
                    allowClear
                    onChange={(value) =>
                      this.onSearchChange("departmentId", value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="状态" name="orderStatus">
                  <Select
                    placeholder="请选择状态"
                    options={orderStatusList}
                    onChange={(value) =>
                      this.onSearchChange("orderStatus", value)
                    }
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="提交人" name="creator">
                  <Select
                    placeholder="请选择提交人"
                    showSearch
                    optionFilterProp="label"
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
            <Column title="消耗单号" dataIndex="consumeNumber" width={120} />
            <Column title="医院" dataIndex="hospitalName" width={130} />
            <Column title="科室" dataIndex="departmentName" width={80} />
            <Column title="提交人" dataIndex="userName" width={100} />
            <Column title="提交时间" dataIndex="createTime" width={120} />
            <Column
              title="价格情况"
              dataIndex="isExistUnusualProduct"
              width={90}
              render={(value) => {
                return value ? (
                  <span style={{ color: "red" }}>未设置价格</span>
                ) : (
                  <span style={{ color: "green" }}>正常</span>
                );
              }}
            />
            <Column
              title="状态"
              dataIndex="orderStatusDesc"
              width={80}
              render={(value, record, index) => {
                return (
                  <span style={{ color: colorList[record.orderStatus] }}>
                    {value}
                  </span>
                );
              }}
            />
            <Column
              title="手术单"
              dataIndex="operationPicList"
              width={120}
              render={(value) => {
                return value && value.length > 0 ? (
                  <a onClick={() => this.handleViewPicList(value)}>
                    查看手术单
                  </a>
                ) : (
                  ""
                );
              }}
            />
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
            你确定要{` ${statusTitle} `}这个消耗单吗？
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
          {/* <PreviewImge
          visible={showImage}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          onClose={() => this.setState({ showImage: false })}
        /> */}
          <DialogCarousel
            visible={showPicList}
            data={picList}
            onClose={() => {
              this.setState({
                showPicList: false,
              });
            }}
          />
        </ContentWrap>
      </>
    );
  }
}

export default connect(({ consumeModel }) => ({
  consumeModel,
}))(ConsumeList);
