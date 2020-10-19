import React from "react";
import { connect } from "dva";
import { Space, Table, Input, Form, Row, Col, Select, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
// import styled from "styled-components";
import DetailDialog from "./detailDialog";
import AddDialog from "./addDialog";
import LockInventoryDialog from "./lockInventory";
import UnLockInventoryDialog from "./unLockInventory";
import AddCheckNum from "../../../components/addCheckNum";
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
    dispatch({ type: "makeInventoryModel/storageList" });
    dispatch({ type: "makeInventoryModel/checkStatusList" });
    dispatch({ type: "makeInventoryModel/checkCreatorList" });

    this.getLockList();
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "makeInventoryModel/getTableList",
    });
  };

  getLockList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "makeInventoryModel/lockStockList",
      payload: { type: "init" },
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
    const { searchParams, pagination } = this.props.makeInventoryModel;
    let tmpParams = { searchParams: { ...searchParams, [key]: value } };
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
      type: "makeInventoryModel/getDetailInfo",
      payload: {
        ...msg,
      },
    });
  };

  handleAddGoods = () => {
    const { dispatch } = this.props;
    dispatch({ type: "makeInventoryModel/addGoods" });
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
    dispatch({
      type: "makeInventoryModel/sendCheckInfo",
      payload: {},
    });
  };

  handleClickOpreation = (key) => {
    const { dispatch } = this.props;
    if (key === "add") {
      dispatch({ type: "makeInventoryModel/storageList" });
      dispatch({
        type: "makeInventoryModel/save",
        payload: {
          checkInventoryDialog: true,
        },
      });
    }
    if (key === "lock") {
      dispatch({ type: "makeInventoryModel/unlockStockList" });
      dispatch({
        type: "makeInventoryModel/save",
        payload: {
          lockDialog: true,
        },
      });
    }
    if (key === "unlock") {
      dispatch({ type: "makeInventoryModel/lockStockList" });
    }
  };

  handleLock = (stockId, callBack) => {
    const { dispatch } = this.props;
    dispatch({
      type: "makeInventoryModel/stockLockOrUnlock",
      payload: {
        stockId,
        type: "checkInventory",
        callBack,
      },
    });
  };

  // 选择库位
  chcekInventory = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: "makeInventoryModel/save",
      payload: {
        stockMsg: values,
      },
    });
    dispatch({
      type: "makeInventoryModel/checkInventory",
      payload: { stockId: values.value },
    });
  };

  // 库存上锁弹窗
  lockInventory = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: "makeInventoryModel/stockLockOrUnlock",
      payload: { ...values, type: "lock" },
    });
  };

  // 库存解锁
  handleUnLock = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "makeInventoryModel/stockLockOrUnlock",
      payload: {
        stockId: msg.value,
        type: "unlock",
      },
    });
  };

  render() {
    const { dispatch } = this.props;
    const {
      showDetailDialog,
      currentMsg,
      pagination,
      data,
      loading,
      addOrder,
      checkInventoryDialog,
      dialogBtnLoading,
      inventoryCheck,
      productList,
      statisticList,
      personList,
      scanCode,
      drawerLoading,
      searchParams,
      storageList,
      checkStatusList,
      basicInfo,
      detailList,
      lockDialog,
      unLockDialog,
      unlockStockList,
      stockMsg,
      lockStockList,
      lockNum,
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
                <Form.Item label="盘点仓库" name="stockId">
                  <Select
                    onChange={(value, obj) =>
                      this.onSearchChange("stockId", value)
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
                <Form.Item label="盘点状态" name="checkStatus">
                  <Select
                    onChange={(value) =>
                      this.onSearchChange("checkStatus", value)
                    }
                    options={checkStatusList}
                    showSearch
                    optionFilterProp="label"
                    dropdownMatchSelectWidth={false}
                    placeholder="请选择"
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="盘点人" name="creator">
                  <Select
                    placeholder="请选择"
                    options={personList}
                    onChange={(value) => this.onSearchChange("creator", value)}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="单号" name="checkNo">
                  <Input
                    placeholder="请输入单号"
                    onChange={(e) =>
                      this.onSearchChange("checkNo", e.target.value)
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

                <Button
                  style={{ marginLeft: "20px" }}
                  type="primary"
                  shape="round"
                  danger
                  onClick={() => this.handleClickOpreation("lock")}
                >
                  盘点上锁
                </Button>
                <Button
                  style={{ marginLeft: "8px" }}
                  type="primary"
                  shape="round"
                  onClick={() => this.handleClickOpreation("unlock")}
                >
                  盘点解锁{`（${lockNum || 0}）`}
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
            <Column
              title="序号"
              render={(value, record, index) => index + 1}
              width={80}
            />

            <Column title="单号" dataIndex="checkNo" width={135} />
            <Column title="盘点仓库" dataIndex="stockName" width={180} />
            <Column title="库存数量" dataIndex="inventoryNumber" width={120} />
            <Column title="盘点数量" dataIndex="checkNumber" width={120} />
            <Column title="盘点状态" dataIndex="checkStatusName" width={130} />
            <Column title="盘点人" dataIndex="creatorName" width={130} />
            <Column title="盘点时间" dataIndex="createTime" width={130} />
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
                  type: "makeInventoryModel/save",
                  payload: {
                    showDetailDialog: false,
                  },
                });
              }}
            />
          )}
          {/* 创建盘点单 */}
          {addOrder && (
            <AddCheckNum
              title="新增盘点单"
              onAddGoods={this.handleAddGoods}
              onCodeChange={this.setCode}
              onSubmit={this.handleSubmit}
              data={{
                scanCode,
                inventoryCheck,
                productList,
                statisticList,
                personList,
                drawerLoading,
                stockMsg,
              }}
              onClosed={() => {
                dispatch({
                  type: "makeInventoryModel/save",
                  payload: {
                    addOrder: false,
                    inventoryCheck: {},
                    productList: [],
                    statisticList: [],
                    scanCode: "",
                  },
                });
              }}
            />
          )}
          {/* 盘点选择库位 */}
          {checkInventoryDialog && (
            <AddDialog
              title="添加盘点单"
              data={{ storageList }}
              loading={dialogBtnLoading}
              onLock={this.handleLock}
              onClosed={() => {
                dispatch({
                  type: "makeInventoryModel/save",
                  payload: {
                    checkInventoryDialog: false,
                    dialogBtnLoading: false,
                  },
                });
              }}
              onOk={this.chcekInventory}
            />
          )}
          {/* 锁库弹窗 */}
          {lockDialog && (
            <LockInventoryDialog
              title="盘点上锁"
              data={{ unlockStockList }}
              loading={dialogBtnLoading}
              onClosed={() => {
                dispatch({
                  type: "makeInventoryModel/save",
                  payload: {
                    lockDialog: false,
                    dialogBtnLoading: false,
                  },
                });
              }}
              onOk={this.lockInventory}
            />
          )}
          {/* 解锁库存弹窗 */}
          {unLockDialog && (
            <UnLockInventoryDialog
              title="盘点解锁"
              data={{ lockStockList }}
              loading={dialogBtnLoading}
              onClosed={() => {
                dispatch({
                  type: "makeInventoryModel/save",
                  payload: {
                    unLockDialog: false,
                    dialogBtnLoading: false,
                  },
                });
              }}
              onUnLock={this.handleUnLock}
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
