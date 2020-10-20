import React from "react";
import { connect } from "dva";
import { Space, Table, Input, Form, Row, Col, Select, Button } from "antd";
import styled from "styled-components";
import DetailDialog from "./detailDialog";
import SendGoods from "../../../components/sendGoods";
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

class StockReturnWarehouse extends React.Component {
  searchRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "stockReturnWarehouseModel/getHospital" });
    dispatch({ type: "stockReturnWarehouseModel/replenishStatus" });
    dispatch({ type: "stockReturnWarehouseModel/getSendPersonList" });
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "stockReturnWarehouseModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.stockReturnWarehouseModel;
    dispatch({
      type: "stockReturnWarehouseModel/save",
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
    const { searchParams, pagination } = this.props.stockReturnWarehouseModel;
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
          type: "stockReturnWarehouseModel/getDePartmentByHsp",
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
      type: "stockReturnWarehouseModel/save",
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
      type: "stockReturnWarehouseModel/save",
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
      type: "stockReturnWarehouseModel/save",
      payload: {
        currentMsg: { ...msg },
        showDetailDialog: true,
      },
    });
    dispatch({
      type: "stockReturnWarehouseModel/getAddInfo",
      payload: {
        ...msg,
      },
    });
  };

  changeListData = (current, size) => {
    const { dispatch } = this.props;
    const { inventoryPagination } = this.props.stockReturnWarehouseModel;
    dispatch({
      type: "stockReturnWarehouseModel/save",
      payload: {
        inventoryPagination: {
          ...inventoryPagination,
          current,
          size,
        },
      },
    });

    dispatch({ type: "stockReturnWarehouseModel/queryInventoryProduct" });
  };

  handleCheck = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "stockReturnWarehouseModel/replenishSure",
      payload: {
        id: msg.id,
      },
    });
  };
  handleBack = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: "stockReturnWarehouseModel/replenishRollBack",
      payload: {
        id: record.id,
      },
    });
  };

  handleGetAddInfo = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: "stockReturnWarehouseModel/save",
      payload: {
        addproductDialog: true,
        currentMsg: { ...record },
      },
    });
    dispatch({
      type: "stockReturnWarehouseModel/getAddInfo",
      payload: {
        ...record,
      },
    });
  };

  changeAddInfo = (msg, type) => {
    const { dispatch } = this.props;
    if (type === "person") {
      dispatch({
        type: "stockReturnWarehouseModel/getMobileById",
        payload: {
          ...msg,
        },
      });
      return;
    }
    dispatch({
      type: "stockReturnWarehouseModel/save",
      payload: {
        ...msg,
      },
    });
  };

  handleAddGoods = () => {
    const { dispatch } = this.props;
    dispatch({ type: "stockReturnWarehouseModel/addGoods" });
  };

  handleDeleteGoods = (record, index) => {
    const { dispatch } = this.props;
    dispatch({
      type: "stockReturnWarehouseModel/deleteGoods",
      payload: { msg: record, index },
    });
  };

  setCode = (code) => {
    const { dispatch } = this.props;
    dispatch({
      type: "stockReturnWarehouseModel/save",
      payload: {
        scanCode: code,
      },
    });
  };

  handleSubmit = () => {
    const { dispatch } = this.props;
    dispatch({ type: "stockReturnWarehouseModel/sendOrderSubmit" });
  };

  getDetailList = (type) => {
    const { dispatch } = this.props;
    const { currentMsg } = this.props.stockReturnWarehouseModel;
    if (type === "replenishList") {
      dispatch({
        type: "stockReturnWarehouseModel/getAddInfo",
        payload: {
          ...currentMsg,
        },
      });
    }
    if (type === "deliveryList") {
      dispatch({ type: "stockReturnWarehouseModel/getSendOrderInfo" });
    }
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: "stockListModel/save",
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
      searchParams,
    } = this.props.stockReturnWarehouseModel;
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
                <Form.Item label="调出仓库" name="hospitalId">
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
                <Form.Item label="客户" name="hospitalId">
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
                <Form.Item label="申请人" name="orderStatus">
                  <Select
                    placeholder="请选择状态"
                    options={[]}
                    onChange={(value) =>
                      this.onSearchChange("orderStatus", value)
                    }
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="单号" name="replenishNumber">
                  <Input
                    placeholder="请输入单号"
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
            scroll={{ x: 1500 }}
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
              render={(value, record, index) => index + 1}
              width={80}
            />

            <Column title="单号" dataIndex="code1" width={135} />
            <Column title="调出仓库" dataIndex="code2" width={150} />
            <Column title="调入仓库" dataIndex="code3" width={120} />
            <Column title="申请日期" dataIndex="code4" width={120} />
            <Column title="备货截止日期" dataIndex="code5" width={130} />
            <Column
              title="状态"
              dataIndex="code6"
              width={260}
              render={(value, record) => {
                const { orderStatus, delivery } = record;
                return (
                  <Space>
                    <span style={{ color: colorList[orderStatus] }}>
                      {value}
                    </span>
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
                  {record.orderStatus && record.orderStatus === 2 && (
                    <a onClick={() => this.handleGetAddInfo(record)}>去发货</a>
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

          {/* 详情弹窗 */}
          {showDetailDialog && (
            <DetailDialog
              title="备货返库单详情"
              groupTitle="备货返库清单"
              data={{ replenishOrderList, currentMsg, deliverInfoList }}
              onGetTableList={this.getDetailList}
              onClosed={() => {
                dispatch({
                  type: "stockReturnWarehouseModel/save",
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
            <SendGoods
              title="备货返库单"
              groupTitle="备货返库清单"
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
                drawerLoading,
              }}
              onClosed={() => {
                dispatch({
                  type: "stockReturnWarehouseModel/save",
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
        </ContentWrap>
      </>
    );
  }
}

export default connect(({ stockReturnWarehouseModel }) => ({
  stockReturnWarehouseModel,
}))(StockReturnWarehouse);
