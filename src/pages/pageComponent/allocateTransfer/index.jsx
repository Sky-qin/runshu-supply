import React from "react";
import { connect } from "dva";
import { Space, Table, Input, Form, Row, Col, Select, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
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

class AllocateTransfer extends React.Component {
  searchRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "allocateTransferModel/getFindAllStock",
      payload: { keyword: "" },
    });
    dispatch({ type: "allocateTransferModel/getSendPersonList" });

    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "allocateTransferModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.allocateTransferModel;
    dispatch({
      type: "allocateTransferModel/save",
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
    const { searchParams, pagination } = this.props.allocateTransferModel;
    let tmpParams = { searchParams: { ...searchParams, [key]: value } };
    dispatch({
      type: "allocateTransferModel/save",
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
      type: "allocateTransferModel/save",
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
      type: "allocateTransferModel/save",
      payload: {
        currentMsg: { ...msg },
        showDetailDialog: true,
      },
    });
    dispatch({
      type: "allocateTransferModel/getDetailInfo",
      payload: {
        ...msg,
      },
    });
  };

  changeAddInfo = (msg, type) => {
    const { dispatch } = this.props;
    dispatch({
      type: "allocateTransferModel/save",
      payload: {
        ...msg,
      },
    });
  };

  handleAddGoods = () => {
    const { dispatch } = this.props;
    dispatch({ type: "allocateTransferModel/addGoods" });
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
      type: "allocateTransferModel/save",
      payload: {
        scanCode: code,
      },
    });
  };

  handleSubmit = () => {
    const { dispatch } = this.props;
    dispatch({ type: "allocateTransferModel/sendOrderSubmit" });
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: "allocateTransferModel/save",
      payload: {
        searchParams: {},
      },
    });
  }

  handleClickOpreation = (key) => {
    const { dispatch } = this.props;
    if (key) {
      dispatch({
        type: "allocateTransferModel/save",
        payload: {
          addproductDialog: true,
        },
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
      allStockList,
      productList,
      personList,
      basicInfo,
    } = this.props.allocateTransferModel;
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
                <Form.Item label="调入仓库" name="stockId">
                  <Select
                    showSearch
                    onChange={(value) => this.onSearchChange("stockId", value)}
                    onSearch={(value) => {
                      dispatch({
                        type: "allocateTransferModel/getFindAllStock",
                        payload: {
                          keyword: value,
                        },
                      });
                    }}
                    options={allStockList}
                    filterOption={false}
                    showArrow={false}
                    dropdownMatchSelectWidth={false}
                    placeholder="请选择"
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="创建人" name="userId">
                  <Select
                    placeholder="请选择状态"
                    options={personList}
                    onChange={(value) => this.onSearchChange("userId", value)}
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
            <Column title="调入仓库" dataIndex="inStock" width={160} />
            <Column
              title="调拨数量"
              dataIndex="productTotalNumber"
              width={120}
            />
            <Column title="创建日期" dataIndex="createTime" width={120} />
            <Column title="创建人" dataIndex="creator" width={120} />
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
                  type: "allocateTransferModel/save",
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
                  type: "allocateTransferModel/getFindAllStock",
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
                allStockList,
                drawerLoading,
              }}
              onClosed={() => {
                dispatch({
                  type: "allocateTransferModel/save",
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

export default connect(({ allocateTransferModel }) => ({
  allocateTransferModel,
}))(AllocateTransfer);
