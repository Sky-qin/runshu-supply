import React from "react";
import { connect } from "dva";
import { Space, Table, Input, Form, Row, Col, Select, Button } from "antd";
import DetailDialog from "./detailDialog";
import SubmitSendGoods from "../../../components/stockSendGoods";
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

class StockList extends React.Component {
  searchRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "stockListModel/getPersonList" });
    dispatch({ type: "stockListModel/personalStock" });
    dispatch({ type: "stockListModel/companyStock" });
    dispatch({ type: "stockListModel/customerList" });

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
        searchParams: {},
        pagination: {
          current: 1,
          size: 10,
          total: 0,
        },
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
      type: "stockListModel/getDetail",
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
    dispatch({
      type: "stockListModel/save",
      payload: {
        ...msg,
      },
    });
  };

  handleAddGoods = (audio) => {
    const { dispatch } = this.props;
    dispatch({ type: "stockListModel/addGoods", payload: { audio } });
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
      customerList,
      addproductDialog,
      basicInfo,
      scanCodeProductList,
      personList,
      scanCode,
      drawerLoading,
      deliverInfoList,
      personalStockList,
      productList,
      companyStockList,
      serialnoList,
      backStockList,
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
          >
            <Row>
              <Col span={6}>
                <Form.Item label="调入仓库" name="inStockId">
                  <Select
                    onChange={(value) =>
                      this.onSearchChange("inStockId", value)
                    }
                    options={personalStockList}
                    showSearch
                    optionFilterProp="label"
                    dropdownMatchSelectWidth={false}
                    placeholder="请选择"
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
                    options={customerList}
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
            <Column title="单号" dataIndex="orderNumber" width={140} />
            <Column title="调出仓库" dataIndex="outStock" width={160} />
            <Column title="调入仓库" dataIndex="inStock" width={120} />
            <Column title="客户" dataIndex="hospitalName" width={160} />
            <Column title="申请日期" dataIndex="createTime" width={115} />
            <Column
              title="备货截止日期"
              dataIndex="expectCompleteDate"
              width={130}
            />
            <Column title="创建人" dataIndex="userName" width={100} />
            <Column
              title="备货数量"
              dataIndex="productTotalNumber"
              width={120}
            />
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
            <Column title="状态" dataIndex="orderStatusStr" width={120} />
            <Column
              title="操作"
              width={170}
              fixed="right"
              render={(value, record, index) => {
                const { enable, orderStatus } = record;
                return (
                  <Space size="middle">
                    {enable && orderStatus === 11 && (
                      <a onClick={() => this.handleGetAddInfo(record)}>
                        去备货
                      </a>
                    )}
                    {enable && orderStatus === 12 && (
                      <a onClick={() => this.handleGetAddInfo(record)}>
                        继续备货
                      </a>
                    )}
                    <a onClick={() => this.handleShowDetail(record)}>
                      查看详情
                    </a>
                  </Space>
                );
              }}
            />
          </Table>

          {/* 编辑弹窗 */}
          {showDetailDialog && (
            <DetailDialog
              title="备货单详情"
              data={{
                basicInfo,
                productList,
                serialnoList,
                currentMsg,
                deliverInfoList,
                backStockList,
              }}
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
                basicInfo,
                scanCode,
                companyStockList,
                personalStockList,
                productList,
                scanCodeProductList,
                drawerLoading,
              }}
              onClosed={() => {
                dispatch({
                  type: "stockListModel/save",
                  payload: {
                    addproductDialog: false,
                    basicInfo: {},
                    scanCode: "",
                    productList: [],
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
