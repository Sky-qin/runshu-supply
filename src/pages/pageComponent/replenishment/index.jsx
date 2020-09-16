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
  TreeSelect,
} from "antd";
import EditDialog from "./editDialog";
import ContentWrap from "../../../components/contentWrap";
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

class Replenishment extends React.Component {
  searchRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "replenishmentModel/getHospital",
    });
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "replenishmentModel/queryInventoryList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.replenishmentModel;
    dispatch({
      type: "replenishmentModel/save",
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
    const { searchParams, pagination } = this.props.replenishmentModel;
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
          type: "replenishmentModel/getDePartmentByHsp",
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
      type: "replenishmentModel/save",
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
      type: "replenishmentModel/save",
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
      type: "replenishmentModel/save",
      payload: {
        currentMsg: { ...msg },
      },
    });

    dispatch({
      type: "replenishmentModel/queryInventoryProduct",
    });
  };

  changeListData = (current, size) => {
    const { dispatch } = this.props;
    const { inventoryPagination } = this.props.replenishmentModel;
    dispatch({
      type: "replenishmentModel/save",
      payload: {
        inventoryPagination: {
          ...inventoryPagination,
          current,
          size,
        },
      },
    });

    dispatch({ type: "replenishmentModel/queryInventoryProduct" });
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
    } = this.props.replenishmentModel;
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
                <Form.Item label="医院" name="hospitalId">
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
              <Col span={6}>
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
              </Col>
              <Col span={6}>
                <Form.Item label="状态" name="orderStatus">
                  <Select
                    placeholder="请选择状态"
                    options={orderStatusList}
                    onChange={(value) =>
                      this.onSearchChange("orderStatus", value)
                    }
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="补货单号" name="consumeName">
                  <Input
                    placeholder="请输入补货单号"
                    onChange={(e) =>
                      this.onSearchChange("consumeName", e.target.value)
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
            <Column title="补货单号" dataIndex="" width={130} />
            <Column title="库位" dataIndex="" width={130} />
            <Column title="补货数量" dataIndex="" width={130} />
            <Column title="申请人" dataIndex="" width={130} />
            <Column title="部门" dataIndex="" width={130} />
            <Column title="申请日期" dataIndex="" width={130} />
            <Column title="状态" dataIndex="" width={130} />
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
          {showDetailDialog && (
            <EditDialog
              title="补货单详情"
              data={{ inventoryList, currentMsg, inventoryPagination }}
              onClosed={() => {
                dispatch({
                  type: "replenishmentModel/save",
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

export default connect(({ replenishmentModel }) => ({
  replenishmentModel,
}))(Replenishment);
