import React from "react";
import { connect } from "dva";
import { Space, Table, Input, Form, Row, Col, Select, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DetailDialog from "./detailDialog";
import SendGoods from "../../../components/backStoreGoods";
import ContentWrap from "../../../components/contentWrap";
import { OpreationBar } from "wrapd";

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

class StockReturnWarehouse extends React.Component {
  searchRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "stockReturnWarehouseModel/personalStock" });
    dispatch({ type: "stockReturnWarehouseModel/companyStock" });
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
    const { searchParams, pagination } = this.props.stockReturnWarehouseModel;
    let tmpParams = { searchParams: { ...searchParams, [key]: value } };
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
      type: "stockReturnWarehouseModel/getDetailInfo",
      payload: {
        ...msg,
      },
    });
  };

  changeAddInfo = (msg, type, value) => {
    const { dispatch } = this.props;
    dispatch({
      type: "stockReturnWarehouseModel/save",
      payload: {
        ...msg,
      },
    });
  };

  handleAddGoods = (audio) => {
    const { dispatch } = this.props;
    dispatch({
      type: "stockReturnWarehouseModel/addGoods",
      payload: { audio },
    });
  };

  handleDeleteGoods = (record, index) => {
    const { dispatch, stockReturnWarehouseModel } = this.props;
    const { productList } = stockReturnWarehouseModel;
    productList.splice(index, 1);
    dispatch({
      type: "stockReturnWarehouseModel/save",
      payload: {
        productList: [...productList],
      },
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

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: "stockReturnWarehouseModel/save",
      payload: {
        searchParams: {},
      },
    });
  }

  handleClickOpreation = (key) => {
    const { dispatch } = this.props;
    if (key) {
      dispatch({
        type: "stockReturnWarehouseModel/initAddRepareBack",
      });
    }
  };

  render() {
    const { dispatch } = this.props;
    const {
      showDetailDialog,
      pagination,
      data,
      loading,
      addproductDialog,
      addInfo,
      scanCode,
      drawerLoading,
      // new
      productList,
      personList,
      basicInfo,
      personalStockList,
      companyStockList,
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
                <Form.Item label="调出仓库" name="outStockId">
                  <Select
                    onChange={(value) =>
                      this.onSearchChange("outStockId", value)
                    }
                    options={personalStockList}
                    showSearch
                    optionFilterProp="label"
                    dropdownMatchSelectWidth={false}
                    placeholder="请选择"
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="创建人" name="creator">
                  <Select
                    placeholder="请选择状态"
                    showSearch
                    optionFilterProp="label"
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
            buttonList={[{ key: "add", label: "新增", icon: <PlusOutlined /> }]}
            total={total}
            onClick={this.handleClickOpreation}
          />
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

            <Column title="单号" dataIndex="orderNumber" width={135} />
            <Column title="调出仓库" dataIndex="outStock" width={160} />
            {/* <Column title="调入仓库" dataIndex="inStock" width={160} /> */}
            <Column title="返库数量" dataIndex="returnStockNum" width={120} />
            <Column title="创建日期" dataIndex="createTime" width={120} />
            <Column title="创建人" dataIndex="creatorName" width={120} />
            <Column
              title="操作"
              width={120}
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
              title="调拨单详情"
              groupTitle="调拨清单"
              data={basicInfo}
              onClosed={() => {
                dispatch({
                  type: "stockReturnWarehouseModel/save",
                  payload: {
                    showDetailDialog: false,
                    basicInfo: {},
                  },
                });
              }}
            />
          )}
          {/* 发货单 */}
          {addproductDialog && (
            <SendGoods
              title="调拨单"
              groupTitle="调拨清单"
              onChange={this.changeAddInfo}
              onAddGoods={this.handleAddGoods}
              onGetStockList={(value) => {
                dispatch({
                  type: "stockReturnWarehouseModel/getFindAllStock",
                  payload: {
                    keyword: value,
                  },
                });
              }}
              onDelete={this.handleDeleteGoods}
              onCodeChange={this.setCode}
              onSubmit={this.handleSubmit}
              data={{
                addInfo,
                scanCode,
                productList,
                personalStockList,
                companyStockList,
                drawerLoading,
              }}
              onClosed={() => {
                dispatch({
                  type: "stockReturnWarehouseModel/save",
                  payload: {
                    addproductDialog: false,
                    addInfo: {},
                    scanCode: "",
                    productList: [],
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
