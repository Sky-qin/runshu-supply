import React from "react";
import { connect } from "dva";
import { Space, Table, Input, Form, Row, Col, Select, Button } from "antd";
import DetailDialog from "./detailDialog";
import SubmitSendGoods from "../../../components/stockSendGoods";
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

const colorList = {
  1: "#f60",
  2: "#f60",
  3: "red",
  4: "#f60",
  5: "#f60",
  6: "#52c41a",
};

class StockList extends React.Component {
  searchRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "stockListModel/getHospital" });
    dispatch({ type: "stockListModel/replenishStatus" });
    dispatch({ type: "stockListModel/getSendPersonList" });
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "stockListModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.stockListModel;
    dispatch({
      type: "stockListModel/save",
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
    const { searchParams, pagination } = this.props.stockListModel;
    let tmpParams = { searchParams: { ...searchParams, [key]: value } };

    dispatch({
      type: "stockListModel/save",
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
    dispatch({
      type: "stockListModel/save",
      payload: {
        searchParams: {
          hospitalId: null,
        },
        departmentList: [],
      },
    });
    setTimeout(() => {
      searchForm.resetFields();
    }, 0);
    this.getTableList();
  };

  handleShowDetail = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "stockListModel/save",
      payload: {
        currentMsg: { ...msg },
        showDetailDialog: true,
      },
    });
    dispatch({
      type: "stockListModel/getAddInfo",
      payload: {
        ...msg,
      },
    });
  };

  changeListData = (current, size) => {
    const { dispatch } = this.props;
    const { inventoryPagination } = this.props.stockListModel;
    dispatch({
      type: "stockListModel/save",
      payload: {
        inventoryPagination: {
          ...inventoryPagination,
          current,
          size,
        },
      },
    });

    dispatch({ type: "stockListModel/queryInventoryProduct" });
  };

  handleCheck = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "stockListModel/replenishSure",
      payload: {
        id: msg.id,
      },
    });
  };
  handleBack = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: "stockListModel/replenishRollBack",
      payload: {
        id: record.id,
      },
    });
  };

  handleGetAddInfo = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: "stockListModel/save",
      payload: {
        addproductDialog: true,
        currentMsg: { ...record },
      },
    });
    dispatch({
      type: "stockListModel/getAddInfo",
      payload: {
        ...record,
      },
    });
  };

  changeAddInfo = (msg, type) => {
    const { dispatch } = this.props;
    if (type === "person") {
      dispatch({
        type: "stockListModel/getMobileById",
        payload: {
          ...msg,
        },
      });
      return;
    }
    dispatch({
      type: "stockListModel/save",
      payload: {
        ...msg,
      },
    });
  };

  handleAddGoods = () => {
    const { dispatch } = this.props;
    dispatch({ type: "stockListModel/addGoods" });
  };

  handleDeleteGoods = (record, index) => {
    const { dispatch } = this.props;
    dispatch({
      type: "stockListModel/deleteGoods",
      payload: { msg: record, index },
    });
  };

  setCode = (code) => {
    const { dispatch } = this.props;
    dispatch({
      type: "stockListModel/save",
      payload: {
        scanCode: code,
      },
    });
  };

  handleSubmit = () => {
    const { dispatch } = this.props;
    dispatch({ type: "stockListModel/sendOrderSubmit" });
  };

  getDetailList = (type) => {
    const { dispatch } = this.props;
    const { currentMsg } = this.props.stockListModel;
    if (type === "replenishList") {
      dispatch({
        type: "stockListModel/getAddInfo",
        payload: {
          ...currentMsg,
        },
      });
    }
    if (type === "deliveryList") {
      dispatch({ type: "stockListModel/getSendOrderInfo" });
    }
  };

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
    } = this.props.stockListModel;
    const { current, size, total } = pagination;
    return (
      <>
        <ContentWrap>
          <Form
            {...layout}
            ref={this.searchRef}
            onFinish={this.onFinish}
            style={{ marginTop: "24px" }}
            initialValues={{
              ...searchParams,
            }}
          >
            <Row>
              <Col span={6}>
                <Form.Item label="调入仓库" name="hospitalId">
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
            scroll={{ x: 1300 }}
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
            <Column title="客户" dataIndex="" width={120} />
            <Column title="申请日期" dataIndex="code4" width={120} />
            <Column title="备货截止日期" dataIndex="code5" width={130} />
            <Column title="申请人" dataIndex="code5" width={100} />
            <Column title="备货数量" dataIndex="code5" width={120} />
            <Column
              title="状态"
              dataIndex="code6"
              width={120}
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
              width={170}
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

          {/* 编辑弹窗 */}
          {showDetailDialog && (
            <DetailDialog
              title="备货单详情"
              data={{ replenishOrderList, currentMsg, deliverInfoList }}
              onGetTableList={this.getDetailList}
              onClosed={() => {
                dispatch({
                  type: "stockListModel/save",
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
                drawerLoading,
              }}
              onClosed={() => {
                dispatch({
                  type: "stockListModel/save",
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

export default connect(({ stockListModel }) => ({
  stockListModel,
}))(StockList);
