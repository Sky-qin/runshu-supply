import React from "react";
import { connect } from "dva";
import { Space, Table, Input, Form, Row, Col, Select, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
// import styled from "styled-components";
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

class MakeInventory extends React.Component {
  searchRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "makeInventoryModel/getHospital" });
    dispatch({ type: "makeInventoryModel/replenishStatus" });
    dispatch({ type: "makeInventoryModel/getSendPersonList" });
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "makeInventoryModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.makeInventoryModel;
    dispatch({
      type: "makeInventoryModel/save",
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
    const { searchParams, pagination } = this.props.makeInventoryModel;
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
          type: "makeInventoryModel/getDePartmentByHsp",
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
      type: "makeInventoryModel/save",
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
      type: "makeInventoryModel/save",
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
      type: "makeInventoryModel/save",
      payload: {
        currentMsg: { ...msg },
        showDetailDialog: true,
      },
    });
    dispatch({
      type: "makeInventoryModel/getAddInfo",
      payload: {
        ...msg,
      },
    });
  };

  changeListData = (current, size) => {
    const { dispatch } = this.props;
    const { inventoryPagination } = this.props.makeInventoryModel;
    dispatch({
      type: "makeInventoryModel/save",
      payload: {
        inventoryPagination: {
          ...inventoryPagination,
          current,
          size,
        },
      },
    });

    dispatch({ type: "makeInventoryModel/queryInventoryProduct" });
  };

  handleCheck = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "makeInventoryModel/replenishSure",
      payload: {
        id: msg.id,
      },
    });
  };
  handleBack = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: "makeInventoryModel/replenishRollBack",
      payload: {
        id: record.id,
      },
    });
  };

  handleGetAddInfo = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: "makeInventoryModel/save",
      payload: {
        addproductDialog: true,
        currentMsg: { ...record },
      },
    });
    dispatch({
      type: "makeInventoryModel/getAddInfo",
      payload: {
        ...record,
      },
    });
  };

  changeAddInfo = (msg, type) => {
    const { dispatch } = this.props;
    if (type === "person") {
      dispatch({
        type: "makeInventoryModel/getMobileById",
        payload: {
          ...msg,
        },
      });
      return;
    }
    dispatch({
      type: "makeInventoryModel/save",
      payload: {
        ...msg,
      },
    });
  };

  handleAddGoods = () => {
    const { dispatch } = this.props;
    dispatch({ type: "makeInventoryModel/addGoods" });
  };

  handleDeleteGoods = (record, index) => {
    const { dispatch } = this.props;
    dispatch({
      type: "makeInventoryModel/deleteGoods",
      payload: { msg: record, index },
    });
  };

  setCode = (code) => {
    const { dispatch } = this.props;
    dispatch({
      type: "makeInventoryModel/save",
      payload: {
        scanCode: code,
      },
    });
  };

  handleSubmit = () => {
    const { dispatch } = this.props;
    dispatch({ type: "makeInventoryModel/sendOrderSubmit" });
  };

  getDetailList = (type) => {
    const { dispatch } = this.props;
    const { currentMsg } = this.props.makeInventoryModel;
    if (type === "replenishList") {
      dispatch({
        type: "makeInventoryModel/getAddInfo",
        payload: {
          ...currentMsg,
        },
      });
    }
    if (type === "deliveryList") {
      dispatch({ type: "makeInventoryModel/getSendOrderInfo" });
    }
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

  render() {
    const { dispatch } = this.props;
    const {
      showDetailDialog,
      currentMsg,
      pagination,
      data,
      loading,
      hospitalList,
      addproductDialog,
      addInfo,
      replenishOrderList,
      scanCodeProductList,
      personList,
      scanCode,
      drawerLoading,
      deliverInfoList,
      searchParams,
    } = this.props.makeInventoryModel;
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
                <Form.Item label="盘点仓库" name="hospitalId">
                  <Select
                    onChange={(value) =>
                      this.onSearchChange("hospitalId", value)
                    }
                    options={hospitalList}
                    showSearch
                    optionFilterProp="label"
                    dropdownMatchSelectWidth={false}
                    placeholder="请选择"
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="盘点状态" name="hospitalId">
                  <Select
                    onChange={(value) =>
                      this.onSearchChange("hospitalId", value)
                    }
                    options={hospitalList}
                    showSearch
                    optionFilterProp="label"
                    dropdownMatchSelectWidth={false}
                    placeholder="请选择"
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="盘点人" name="orderStatus">
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
          <OpreationBar
            buttonList={[{ key: "add", label: "新增", icon: <PlusOutlined /> }]}
            total={total}
            onClick={this.handleClickOpreation}
          />
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
            <Column title="盘点仓库" dataIndex="code2" width={180} />
            <Column title="库存数量" dataIndex="code3" width={120} />
            <Column title="盘点数量" dataIndex="code4" width={120} />
            <Column title="盘点状态" dataIndex="code5" width={130} />
            <Column title="盘点人" dataIndex="code5" width={130} />
            <Column title="盘点时间" dataIndex="code5" width={130} />
            <Column
              title="操作"
              width={280}
              fixed="right"
              render={(value, record, index) => (
                <Space size="middle">
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
                  type: "makeInventoryModel/save",
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
                  type: "makeInventoryModel/save",
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

export default connect(({ makeInventoryModel }) => ({
  makeInventoryModel,
}))(MakeInventory);
