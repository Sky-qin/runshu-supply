import React from "react";
import { connect } from "dva";
import { Space, Table, Input, Form, Row, Col, Select, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DetailDialog from "./detailDialog";
import AddProfitAndLoss from "../../../components/addProfitAndLoss";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";

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

class InventoryProfit extends React.Component {
  searchRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "inventoryProfitModel/storageList" });
    dispatch({ type: "inventoryProfitModel/findUserList" });

    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "inventoryProfitModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.inventoryProfitModel;
    dispatch({
      type: "inventoryProfitModel/save",
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
    const { searchParams, pagination } = this.props.inventoryProfitModel;
    let tmpParams = { searchParams: { ...searchParams, [key]: value } };
    dispatch({
      type: "inventoryProfitModel/save",
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
      type: "inventoryProfitModel/save",
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
      type: "inventoryProfitModel/save",
      payload: {
        currentMsg: { ...msg },
        showDetailDialog: true,
      },
    });
    dispatch({
      type: "inventoryProfitModel/getDetailInfo",
      payload: {
        ...msg,
      },
    });
  };

  handleAddGoods = (audio) => {
    const { dispatch } = this.props;
    dispatch({ type: "inventoryProfitModel/addGoods", payload: { audio } });
  };

  setCode = (code) => {
    const { dispatch } = this.props;
    dispatch({
      type: "inventoryProfitModel/save",
      payload: {
        scanCode: code,
      },
    });
  };

  handleSubmit = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "inventoryProfitModel/sendCheckInfo",
    });
  };

  handleClickOpreation = (key) => {
    const { dispatch } = this.props;
    if (key === "add") {
      dispatch({ type: "inventoryProfitModel/storageList" });
      dispatch({
        type: "inventoryProfitModel/save",
        payload: {
          addOrder: true,
        },
      });
    }
  };

  changeAddInfo = (msg, key) => {
    const { dispatch } = this.props;
    if (key === "stockId") {
      dispatch({
        type: "inventoryProfitModel/save",
        payload: {
          remarks: "",
          productList: [],
        },
      });
    }
    dispatch({
      type: "inventoryProfitModel/save",
      payload: {
        ...msg,
      },
    });
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: "inventoryProfitModel/save",
      payload: {
        searchParams: {},
        pagination: {
          current: 1,
          size: 10,
          total: 0,
        },
      },
    });
  }

  render() {
    const { dispatch } = this.props;
    const {
      showDetailDialog,
      pagination,
      data,
      loading,
      addOrder,
      productList,
      personList,
      scanCode,
      drawerLoading,
      storageList,
      basicInfo,
      detailList,
    } = this.props.inventoryProfitModel;
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
                <Form.Item label="仓库" name="locationCode">
                  <Select
                    onChange={(value, obj) =>
                      this.onSearchChange("locationCode", value)
                    }
                    options={storageList}
                    showSearch
                    optionFilterProp="label"
                    dropdownMatchSelectWidth={false}
                    placeholder="请选择"
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="创建人" name="creator">
                  <Select
                    placeholder="请选择"
                    options={personList}
                    onChange={(value) => this.onSearchChange("creator", value)}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="单号" name="orderNumber">
                  <Input
                    placeholder="请输入单号"
                    onChange={(e) =>
                      this.onSearchChange("orderNumber", e.target.value)
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
            custom={
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => this.handleClickOpreation("add")}
                >
                  新增
                </Button>
              </Space>
            }
            total={total}
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
            {/* <Column
              title="序号"
              render={(value, record, index) => index + 1}
              width={80}
            /> */}

            <Column title="单号" dataIndex="orderNumber" width={120} />
            <Column title="仓库" dataIndex="stockName" width={180} />
            <Column
              title="入库数量"
              dataIndex="productTotalNumber"
              width={120}
            />
            <Column title="创建人" dataIndex="userName" width={120} />
            <Column title="创建时间" dataIndex="createTime" width={130} />
            <Column
              title="操作"
              width={100}
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
              title="盘点单详情"
              data={{ detailList, basicInfo }}
              onClosed={() => {
                dispatch({
                  type: "inventoryProfitModel/save",
                  payload: {
                    showDetailDialog: false,
                  },
                });
              }}
            />
          )}
          {/* 创建盘点单 */}
          {addOrder && (
            <AddProfitAndLoss
              title="新增盘盈单"
              onChange={this.changeAddInfo}
              onAddGoods={this.handleAddGoods}
              onCodeChange={this.setCode}
              onSubmit={this.handleSubmit}
              data={{
                scanCode,
                productList,
                drawerLoading,
                storageList,
              }}
              onClosed={() => {
                dispatch({
                  type: "inventoryProfitModel/save",
                  payload: {
                    addOrder: false,
                    productList: [],
                    scanCode: "",
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

export default connect(({ inventoryProfitModel }) => ({
  inventoryProfitModel,
}))(InventoryProfit);
