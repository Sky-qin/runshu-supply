import React from "react";
import { connect } from "dva";
import {
  Space,
  Table,
  Input,
  Form,
  Row,
  Col,
  Select,
  Button,
  Popconfirm,
} from "antd";
import DetailDialog from "./detailDialog";
import AddDialog from "./addGoods";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";
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

class Replenishment extends React.Component {
  searchRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "replenishmentModel/getHospital",
    });
    dispatch({
      type: "replenishmentModel/replenishStatus",
    });
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "replenishmentModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.replenishmentModel;
    dispatch({
      type: "replenishmentModel/save",
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

  onSearchChange = (key, value) => {
    const { dispatch } = this.props;
    let { current: searchForm } = this.searchRef;
    const { searchParams, pagination } = this.props.replenishmentModel;
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
          type: "replenishmentModel/getDePartmentByHsp",
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
      type: "replenishmentModel/save",
      payload: {
        ...tmpParams,
        pagination: {
          ...pagination,
          current: 1,
        },
      },
    });
  };

  onFinish = (values) => {
    this.getTableList();
  };

  onReset = () => {
    let { current: searchForm } = this.searchRef;
    const { dispatch } = this.props;
    searchForm.resetFields();
    dispatch({
      type: "replenishmentModel/save",
      payload: {
        searchParams: {},
        departmentList: [],
      },
    });
    this.getTableList();
  };

  handleShowDetail = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "replenishmentModel/save",
      payload: {
        currentMsg: { ...msg },
        showDetailDialog: true,
      },
    });
  };

  changeListData = (current, size) => {
    const { dispatch } = this.props;
    const { inventoryPagination } = this.props.replenishmentModel;
    dispatch({
      type: "replenishmentModel/save",
      payload: {
        inventoryPagination: {
          ...inventoryPagination,
          current,
          size,
        },
      },
    });

    dispatch({ type: "replenishmentModel/queryInventoryProduct" });
  };

  handleCheck = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "replenishmentModel/replenishSure",
      payload: {
        id: msg.id,
      },
    });
  };
  handleBack = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: "replenishmentModel/replenishRollBack",
      payload: {
        id: record.id,
      },
    });
  };

  handleGetAddInfo = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: "replenishmentModel/save",
      payload: {
        addproductDialog: true,
      },
    });
  };

  changeAddInfo = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "replenishmentModel/save",
      payload: {
        ...msg,
      },
    });
  };

  handleSubmit = () => {
    const { addInfo } = this.props.replenishmentModel;
    console.log("addInfo", addInfo);
  };

  render() {
    const { dispatch } = this.props;
    const {
      showDetailDialog,
      inventoryPagination,
      inventoryList,
      currentMsg,
      pagination,
      data,
      loading,
      hospitalList,
      replenishStatusList,
      addproductDialog,
      addInfo,
    } = this.props.replenishmentModel;
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
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="状态" name="orderStatus">
                  <Select
                    placeholder="请选择状态"
                    options={replenishStatusList}
                    onChange={(value) =>
                      this.onSearchChange("orderStatus", value)
                    }
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="补货单号" name="replenishNumber">
                  <Input
                    placeholder="请输入补货单号"
                    onChange={(e) =>
                      this.onSearchChange("replenishNumber", e.target.value)
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
            dataSource={[{ orderStatus: 2 }]}
            pagination={{
              position: ["bottomCenter"],
              current: current,
              total: total || 0,
              pageSize: size,
              onChange: this.changePagination,
              onShowSizeChange: this.changePagination,
            }}
          >
            <Column title="补货单号" dataIndex="replenishNumber" width={130} />
            <Column title="医院" dataIndex="hospitalName" width={130} />
            <Column title="补货数量" dataIndex="replenishNum" width={130} />
            <Column title="申请人" dataIndex="userName" width={130} />
            <Column title="部门" dataIndex="departmentName" width={130} />
            <Column title="申请日期" dataIndex="createTime" width={130} />
            <Column title="状态" dataIndex="orderStatusStr" width={130} />
            <Column
              title="操作"
              width={150}
              lock="right"
              render={(value, record, index) => (
                <Space size="middle">
                  {record.orderStatus && record.orderStatus === 1 && (
                    <Popconfirm
                      title="您是要确定该补货单吗？"
                      onConfirm={() => this.handleCheck(record)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a href="#">确定</a>
                    </Popconfirm>
                  )}
                  {record.orderStatus && record.orderStatus === 2 && (
                    <a onClick={() => this.handleGetAddInfo(record)}>去发货</a>
                  )}
                  {record.orderStatus && record.orderStatus === 2 && (
                    <Popconfirm
                      title="您是要撤销这个补货单吗？"
                      onConfirm={() => this.handleBack(record)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a href="#">撤销确定</a>
                    </Popconfirm>
                  )}

                  {record.orderStatus && record.orderStatus === 4 && (
                    <a onClick={() => this.handleGetAddInfo(record)}>
                      继续发货
                    </a>
                  )}

                  <a onClick={() => this.handleShowDetail(record)}>查看详情</a>
                </Space>
              )}
            />
          </Table>

          {/* 编辑弹窗 */}
          {showDetailDialog && (
            <DetailDialog
              title="补货单详情"
              data={{ inventoryList, currentMsg, inventoryPagination }}
              onClosed={() => {
                dispatch({
                  type: "replenishmentModel/save",
                  payload: {
                    showDetailDialog: false,
                    inventoryPagination: {
                      current: 1,
                      size: 50,
                      total: 0,
                    },
                  },
                });
              }}
              onChange={this.changeListData}
            />
          )}
          {/* 发货单 */}

          {addproductDialog && (
            <AddDialog
              onChange={this.changeAddInfo}
              onSubmit={this.handleSubmit}
              data={{ addInfo }}
              onClosed={() => {
                dispatch({
                  type: "replenishmentModel/save",
                  payload: {
                    addproductDialog: false,
                  },
                });
              }}
            />
          )}
        </ContentWrap>
      </>
    );
  }
}

export default connect(({ replenishmentModel }) => ({
  replenishmentModel,
}))(Replenishment);
