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
import styled from "styled-components";
import DetailDialog from "./detailDialog";
import SubmitSendGoods from "../../../components/submitSendGoods";
import { OpreationBar, ContentBox } from "wrapd";

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

const SpanBox = styled.span`
  color: red;
`;

const colorList = {
  1: "#f60",
  2: "#f60",
  3: "red",
  4: "#f60",
  5: "#f60",
  6: "#52c41a",
};

class Replenishment extends React.Component {
  searchRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({ type: "replenishmentModel/companyStock" });
    dispatch({ type: "replenishmentModel/getHospital" });
    dispatch({ type: "replenishmentModel/replenishStatus" });
    dispatch({ type: "replenishmentModel/getSendPersonList" });
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
    const { searchParams, pagination } = this.props.replenishmentModel;
    let tmpParams = { searchParams: { ...searchParams, [key]: value } };

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
    dispatch({
      type: "replenishmentModel/getAddInfo",
      payload: {
        ...msg,
        type: "view",
      },
    });
    dispatch({ type: "replenishmentModel/getSendOrderInfo" });
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
        currentMsg: { ...record },
      },
    });
    dispatch({
      type: "replenishmentModel/getAddInfo",
      payload: {
        ...record,
        type: "send",
      },
    });
  };

  changeAddInfo = (msg, type) => {
    const { dispatch, replenishmentModel } = this.props;
    const { scanCodeProductList } = replenishmentModel;
    if (type === "person") {
      dispatch({
        type: "replenishmentModel/getMobileById",
        payload: {
          ...msg,
        },
      });
      return;
    }
    if (type === "outStockId") {
      if (scanCodeProductList && scanCodeProductList.length > 0) {
        dispatch({ type: "replenishmentModel/initAddInfo" });
      }
    }
    dispatch({
      type: "replenishmentModel/save",
      payload: {
        ...msg,
      },
    });
  };

  handleAddGoods = () => {
    const { dispatch } = this.props;
    dispatch({ type: "replenishmentModel/addGoods" });
  };

  handleDeleteGoods = (record, index) => {
    const { dispatch } = this.props;
    dispatch({
      type: "replenishmentModel/deleteGoods",
      payload: { msg: record, index },
    });
  };

  setCode = (code) => {
    const { dispatch } = this.props;
    dispatch({
      type: "replenishmentModel/save",
      payload: {
        scanCode: code,
      },
    });
  };

  handleSubmit = () => {
    const { dispatch } = this.props;
    dispatch({ type: "replenishmentModel/sendOrderSubmit" });
  };

  // getDetailList = (type) => {
  //   const { dispatch } = this.props;
  //   const { currentMsg } = this.props.replenishmentModel;
  //   if (type === "replenishList") {
  //     dispatch({
  //       type: "replenishmentModel/getAddInfo",
  //       payload: {
  //         ...currentMsg,
  //         type: "view",
  //       },
  //     });
  //   }
  //   if (type === "deliveryList") {
  //     dispatch({ type: "replenishmentModel/getSendOrderInfo" });
  //   }
  // };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: "replenishmentModel/save",
      payload: {
        searchParams: {},
      },
    });
  }

  render() {
    const { dispatch } = this.props;
    const {
      showDetailDialog,
      currentMsg,
      pagination,
      data,
      loading,
      hospitalList,
      replenishStatusList,
      addproductDialog,
      addInfo,
      replenishOrderList,
      scanCodeProductList,
      personList,
      scanCode,
      drawerLoading,
      deliverInfoList,
      companyStockList,
    } = this.props.replenishmentModel;
    const { current, size, total } = pagination;
    return (
      <>
        <ContentBox>
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
                    showSearch
                    optionFilterProp="label"
                    dropdownMatchSelectWidth={false}
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
        </ContentBox>
        <ContentBox loading={loading}>
          <OpreationBar total={total} />
          <Table
            bordered
            scroll={{ x: 1500 }}
            rowKey="replenishNumber"
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
            <Column title="补货单号" dataIndex="replenishNumber" width={135} />
            <Column title="医院" dataIndex="hospitalName" width={150} />
            <Column title="补货数量" dataIndex="replenishNum" width={100} />
            <Column title="部门" dataIndex="departmentName" width={100} />
            <Column title="发起业务端" dataIndex="doctorOrSale" width={120} />
            <Column title="申请人" dataIndex="userName" width={100} />
            <Column title="申请日期" dataIndex="createTime" width={130} />
            <Column
              title="状态"
              dataIndex="orderStatusStr"
              width={260}
              render={(value, record) => {
                const { orderStatus, delivery } = record;
                return (
                  <Space>
                    <span style={{ color: colorList[orderStatus] }}>
                      {value}
                    </span>
                    {(orderStatus === 2 || orderStatus === 4) &&
                      delivery === "1" && <SpanBox>对方提醒发货</SpanBox>}
                  </Space>
                );
              }}
            />
            <Column
              title="操作"
              width={280}
              fixed="right"
              render={(value, record, index) => (
                <Space size="middle">
                  {record.orderStatus === 1 && (
                    <Popconfirm
                      title="您是要确定该补货单吗？"
                      onConfirm={() => this.handleCheck(record)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a>确定</a>
                    </Popconfirm>
                  )}
                  {record.orderStatus === 2 && (
                    <a onClick={() => this.handleGetAddInfo(record)}>去发货</a>
                  )}
                  {record.orderStatus === 2 && (
                    <Popconfirm
                      title="您是要撤销这个补货单吗？"
                      onConfirm={() => this.handleBack(record)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a>撤销确定</a>
                    </Popconfirm>
                  )}

                  {record.orderStatus === 4 && (
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
              data={{
                replenishOrderList,
                currentMsg,
                deliverInfoList,
                addInfo,
              }}
              // onGetTableList={this.getDetailList}
              onClosed={() => {
                dispatch({
                  type: "replenishmentModel/save",
                  payload: {
                    showDetailDialog: false,
                  },
                });
              }}
              onChange={this.changeListData}
            />
          )}
          {/* 发货单 */}
          {addproductDialog && (
            <SubmitSendGoods
              onChange={this.changeAddInfo}
              onAddGoods={this.handleAddGoods}
              onDelete={this.handleDeleteGoods}
              onCodeChange={this.setCode}
              onSubmit={this.handleSubmit}
              data={{
                addInfo,
                scanCode,
                replenishOrderList,
                scanCodeProductList,
                personList,
                companyStockList,
                drawerLoading,
              }}
              onClosed={() => {
                dispatch({
                  type: "replenishmentModel/save",
                  payload: {
                    addproductDialog: false,
                    addInfo: {},
                    scanCode: "",
                    replenishOrderList: [],
                    scanCodeProductList: [],
                  },
                });
              }}
            />
          )}
        </ContentBox>
      </>
    );
  }
}

export default connect(({ replenishmentModel }) => ({
  replenishmentModel,
}))(Replenishment);
