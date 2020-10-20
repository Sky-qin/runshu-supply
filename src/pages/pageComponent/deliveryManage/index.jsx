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
  DatePicker,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AddDialog from "./addDialog";
import DetailDialog from "./detailDialog";
import DeliveryDialog from "./deliveryDialog";
import ReplenishmentDetail from "./replenishmentDetail";
import EditDeliveryDialog from "./editDeliveryDialog";
import SubmitSendGoods from "../../../components/submitSendGoods";
import OpreationBar from "../../../components/OpreationBar";
import ContentWrap from "../../../components/contentWrap";
import "./index.scss";

const { Column } = Table;
const { RangePicker } = DatePicker;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

const tailLayout = {
  wrapperCol: {
    span: 24,
  },
};

class DeliveryManage extends React.Component {
  searchRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "deliveryManageModel/getHospital" });
    dispatch({ type: "deliveryManageModel/getDeliveryStatus" });
    dispatch({ type: "deliveryManageModel/getSendPersonList" });
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "deliveryManageModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.deliveryManageModel;
    dispatch({
      type: "deliveryManageModel/save",
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
    const { searchParams, pagination } = this.props.deliveryManageModel;
    let tmpParams = { searchParams: { ...searchParams, [key]: value } };
    dispatch({
      type: "deliveryManageModel/save",
      payload: {
        ...tmpParams,
        pagination: {
          ...pagination,
          current: 1,
        },
      },
    });
  };

  onFinish = () => {
    this.getTableList();
  };

  onReset = () => {
    let { current: searchForm } = this.searchRef;
    const { dispatch } = this.props;
    searchForm.resetFields();
    dispatch({
      type: "deliveryManageModel/save",
      payload: {
        searchParams: {},
      },
    });
    this.getTableList();
  };

  handleEditDelivery = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: "deliveryManageModel/save",
      payload: {
        currentMsg: { ...record },
        showEditDeliveryDialog: true,
      },
    });
  };

  handleShowDelivery = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: "deliveryManageModel/save",
      payload: {
        showDeliveryDialog: true,
      },
    });
    dispatch({
      type: "deliveryManageModel/getDeliveryInfo",
      payload: {
        deliveryId: record.deliveryId,
      },
    });
  };

  handleShowDetail = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "deliveryManageModel/save",
      payload: {
        currentMsg: { ...msg },
        showDetailDialog: true,
      },
    });

    dispatch({
      type: "deliveryManageModel/querySendOrderDetail",
    });
  };

  changeListData = (current, size, hospitalId) => {
    const { dispatch } = this.props;
    const { inventoryPagination } = this.props.deliveryManageModel;
    dispatch({
      type: "deliveryManageModel/save",
      payload: {
        inventoryPagination: {
          ...inventoryPagination,
          current,
          size,
        },
        hospitalId,
      },
    });

    dispatch({ type: "deliveryManageModel/getReplenishList" });
  };

  handleClickOpreation = (key) => {
    const { dispatch } = this.props;
    if (key === "add") {
      dispatch({
        type: "deliveryManageModel/save",
        payload: {
          addDialog: true,
        },
      });
      dispatch({ type: "deliveryManageModel/getReplenishList" });
      dispatch({ type: "deliveryManageModel/queryReplenishHospitals" });
    }
  };

  handleGetAddInfo = (selectedRowKeys) => {
    const { dispatch } = this.props;
    dispatch({
      type: "deliveryManageModel/save",
      payload: {
        addproductDialog: true,
        hospitalId: "",
        // currentMsg: { ...record },
        selectedRowKeys,
      },
    });
    dispatch({
      type: "deliveryManageModel/getAddInfo",
      payload: {
        selectedRowKeys,
      },
    });
  };

  changeAddInfo = (msg, type) => {
    const { dispatch } = this.props;
    if (type === "person") {
      dispatch({
        type: "deliveryManageModel/getMobileById",
        payload: {
          ...msg,
        },
      });
      return;
    }
    dispatch({
      type: "deliveryManageModel/save",
      payload: {
        ...msg,
      },
    });
  };

  handleAddGoods = () => {
    const { dispatch } = this.props;
    dispatch({ type: "deliveryManageModel/addGoods" });
  };

  handleDeleteGoods = (record, index) => {
    const { dispatch } = this.props;
    dispatch({
      type: "deliveryManageModel/deleteGoods",
      payload: { msg: record, index },
    });
  };

  setCode = (code) => {
    const { dispatch } = this.props;
    dispatch({
      type: "deliveryManageModel/save",
      payload: {
        scanCode: code,
      },
    });
  };

  handleSubmit = () => {
    const { dispatch } = this.props;
    dispatch({ type: "deliveryManageModel/sendOrderSubmit" });
  };

  getReplenishmentDetail = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: "deliveryManageModel/queryReplenishProductDetail",
      payload: { itemId: record.itemId },
    });
  };

  handleDelivery = (values) => {
    const { dispatch } = this.props;
    const { currentMsg } = this.props.deliveryManageModel;
    const params = {
      id: currentMsg.id,
      deliveryId: currentMsg.deliveryId,
      ...values,
    };
    dispatch({
      type: "deliveryManageModel/updateDeliveryInfo",
      payload: { ...params },
    });
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: "deliveryManageModel/save",
      payload: {
        searchParams: {},
      },
    });
  }

  render() {
    const { dispatch } = this.props;
    const {
      showDetailDialog,
      inventoryPagination,
      currentMsg,
      pagination,
      data,
      loading,
      hospitalList,
      personList,
      addDialog,
      addproductDialog,
      addInfo,
      scanCode,
      replenishOrderList,
      scanCodeProductList,
      drawerLoading,
      deliveryStatusList,
      productList,
      basicInfo,
      replenishmentDetailDialog,
      replenishmentList,
      replenishTodoList,
      showDeliveryDialog,
      deliveryInfo,
      showEditDeliveryDialog,
      dialogBtnLoading,
      searchParams,
      hospitalTodoList,
    } = this.props.deliveryManageModel;
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
                <Form.Item label="快递单号" name="expNo">
                  <Input
                    onChange={(e) =>
                      this.onSearchChange("expNo", e.target.value)
                    }
                    placeholder="请输入"
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="收货方" name="receiveName">
                  <Select
                    onChange={(value) =>
                      this.onSearchChange("receiveName", value)
                    }
                    options={hospitalList}
                    placeholder="请选择"
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    dropdownMatchSelectWidth={false}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="发货人" name="deliveryUserId">
                  <Select
                    placeholder="请选择"
                    options={personList}
                    onChange={(value) =>
                      this.onSearchChange("deliveryUserId", value)
                    }
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="物流状态" name="deliveryStatus">
                  <Select
                    placeholder="请选择"
                    options={deliveryStatusList}
                    onChange={(value) =>
                      this.onSearchChange("deliveryStatus", value)
                    }
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item label="发货时间" name="time">
                  <RangePicker
                    format="YYYY-MM-DD"
                    onChange={(value) => this.onSearchChange("time", value)}
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
          <OpreationBar
            buttonList={[{ key: "add", label: "新增", icon: <PlusOutlined /> }]}
            total={total}
            onClick={this.handleClickOpreation}
          />
          <Table
            bordered
            rowKey={(record, index) => index}
            scroll={{ x: 1500 }}
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
            <Column title="快递单号" dataIndex="expNo" width={130} />
            <Column title="快递公司" dataIndex="expCompanyName" width={150} />
            <Column title="收货方" dataIndex="customerName" width={200} />
            <Column title="发货日期" dataIndex="deliveryTime" width={120} />
            <Column title="发货人" dataIndex="deliveryName" width={100} />
            <Column
              title="物流状态"
              dataIndex="deliveryStatusDesc"
              width={130}
            />
            <Column
              title="操作"
              width={260}
              fixed="right"
              render={(value, record, index) => (
                <Space size="middle">
                  <a onClick={() => this.handleEditDelivery(record)}>
                    修改物流
                  </a>
                  <a onClick={() => this.handleShowDelivery(record)}>
                    物流详情
                  </a>
                  <a onClick={() => this.handleShowDetail(record)}>查看详情</a>
                </Space>
              )}
            />
          </Table>
          {/* 编辑弹窗 */}
          {addDialog && (
            <AddDialog
              title="选择补货单"
              data={{
                hospitalTodoList,
                currentMsg,
                replenishTodoList,
                inventoryPagination,
              }}
              onClosed={() => {
                dispatch({
                  type: "deliveryManageModel/save",
                  payload: {
                    addDialog: false,
                    hospitalId: "",
                    inventoryPagination: {
                      current: 1,
                      size: 50,
                      total: 0,
                    },
                  },
                });
              }}
              onChange={this.changeListData}
              onOk={this.handleGetAddInfo}
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
                  type: "deliveryManageModel/save",
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

          {showDetailDialog && (
            <DetailDialog
              title="发货单详情"
              data={{ productList, basicInfo }}
              onClosed={() => {
                dispatch({
                  type: "deliveryManageModel/save",
                  payload: {
                    showDetailDialog: false,
                  },
                });
              }}
              onChange={this.getReplenishmentDetail}
            />
          )}

          {replenishmentDetailDialog && (
            <ReplenishmentDetail
              title="发货单详情"
              data={replenishmentList}
              onClosed={() => {
                dispatch({
                  type: "deliveryManageModel/save",
                  payload: {
                    replenishmentDetailDialog: false,
                  },
                });
              }}
            />
          )}

          {showDeliveryDialog && (
            <DeliveryDialog
              title="物流详情"
              data={deliveryInfo}
              onClosed={() => {
                dispatch({
                  type: "deliveryManageModel/save",
                  payload: {
                    showDeliveryDialog: false,
                  },
                });
              }}
              onChange={this.getReplenishmentDetail}
            />
          )}

          {/* 编辑物流信息弹窗 */}
          {showEditDeliveryDialog && (
            <EditDeliveryDialog
              title="修改物流信息"
              data={currentMsg}
              personList={personList}
              loading={dialogBtnLoading}
              onClosed={() => {
                dispatch({
                  type: "deliveryManageModel/save",
                  payload: {
                    showEditDeliveryDialog: false,
                    dialogBtnLoading: false,
                  },
                });
              }}
              onOk={this.handleDelivery}
            />
          )}
        </ContentWrap>
      </>
    );
  }
}

export default connect(({ deliveryManageModel }) => ({
  deliveryManageModel,
}))(DeliveryManage);
