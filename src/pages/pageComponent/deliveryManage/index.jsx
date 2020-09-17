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
import EditDialog from "./editDialog";
import DetailDialog from "./detailDialog";
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
    dispatch({
      type: "deliveryManageModel/getHospital",
    });
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "deliveryManageModel/queryInventoryList",
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
    let { current: searchForm } = this.searchRef;
    const { searchParams, pagination } = this.props.deliveryManageModel;
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
          type: "deliveryManageModel/getDePartmentByHsp",
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

  onFinish = (values) => {
    console.log("values", values);
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
        departmentList: [],
      },
    });
    this.getTableList();
  };

  handleShowDetail = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "deliveryManageModel/save",
      payload: {
        currentMsg: { ...msg },
      },
    });

    dispatch({
      type: "deliveryManageModel/queryInventoryProduct",
    });
  };

  changeListData = (current, size) => {
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
      },
    });

    dispatch({ type: "deliveryManageModel/queryInventoryProduct" });
  };

  render() {
    const { dispatch } = this.props;
    const {
      showDetailDialog,
      inventoryPagination,
      inventoryList,
      currentMsg,
      pagination,
      data,
      loading,
      departmentList,
      hospitalList,
      orderStatusList,
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
                <Form.Item label="快递单号" name="deliveryCode">
                  <Input
                    onChange={(value) =>
                      this.onSearchChange("deliveryCode", value)
                    }
                    placeholder="请选择医院"
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="收货方" name="hospitalId">
                  <Select
                    onChange={(value) =>
                      this.onSearchChange("hospitalId", value)
                    }
                    options={hospitalList}
                    placeholder="请选择医院"
                    allowClear
                  />
                </Form.Item>
              </Col>
              {/* <Col span={6}>
                <Form.Item label="科室" name="departmentId">
                  <TreeSelect
                    filterTreeNode
                    treeNodeFilterProp="label"
                    placeholder="请选择科室"
                    treeData={departmentList}
                    allowClear
                    onChange={(value) =>
                      this.onSearchChange("departmentId", value)
                    }
                  />
                </Form.Item>
              </Col> */}
              <Col span={6}>
                <Form.Item label="发货人" name="person">
                  <Select
                    placeholder="请选择"
                    options={[]}
                    onChange={(value) => this.onSearchChange("person", value)}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="物流状态" name="deliveryStatus">
                  <Select
                    placeholder="请选择状态"
                    options={[]}
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
                  {/* <Input
                    placeholder="请输入补货单号"
                    onChange={(e) =>
                      this.onSearchChange("time", e.target.value)
                    }
                  /> */}
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
          />
          <Table
            bordered
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
              width={80}
              render={(value, record, index) => index + 1}
            />
            <Column title="快递单号" dataIndex="" width={130} />
            <Column title="快递公司" dataIndex="" width={150} />
            <Column title="收货方" dataIndex="" width={150} />
            <Column title="发货日期" dataIndex="" width={120} />
            <Column title="发货人" dataIndex="" width={130} />
            <Column title="物流状态" dataIndex="" width={130} />
            <Column
              title="操作"
              width={150}
              lock="right"
              render={(value, record, index) => (
                <Space size="middle">
                  <a onClick={() => this.handleShowDetail(record)}>状态</a>
                  <a onClick={() => this.handleShowDetail(record)}>查看详情</a>
                </Space>
              )}
            />
          </Table>
          {/* 编辑弹窗 */}
          {/* {showDetailDialog && (
            <EditDialog
              title="补货单详情"
              data={{ inventoryList, currentMsg, inventoryPagination }}
              onClosed={() => {
                dispatch({
                  type: "deliveryManageModel/save",
                  payload: {
                    showDetailDialog: false,
                    inventoryPagination: {
                      current: 1,
                      size: 50,
                      total: 0,
                    },
                  },
                });
              }}
              onChange={this.changeListData}
            />
          )} */}

          {showDetailDialog && (
            <DetailDialog
              title="发货单详情"
              data={{ inventoryList, currentMsg, inventoryPagination }}
              onClosed={() => {
                dispatch({
                  type: "deliveryManageModel/save",
                  payload: {
                    showDetailDialog: false,
                    inventoryPagination: {
                      current: 1,
                      size: 50,
                      total: 0,
                    },
                  },
                });
              }}
              onChange={this.changeListData}
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
