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

class Replenishment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "replenishmentModel/storageList",
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

  onChangeFilter = (value, key) => {
    const { dispatch, pagination } = this.props;
    dispatch({
      type: "replenishmentModel/save",
      payload: {
        [key]: value,
        pagination: {
          ...pagination,
          current: 1,
        },
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
      applicantList,
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
                <Form.Item label="申请人" name="creator">
                  <Select
                    placeholder="请选择申请人"
                    options={applicantList}
                    onChange={(value) => this.onSearchChange("creator", value)}
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item label="消耗单号" name="consumeName">
                  <Input
                    placeholder="请输入消耗单号"
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
            <Column title="公司" dataIndex="" width={200} />
            <Column title="业务员" dataIndex="" width={100} />
            <Column title="部门" dataIndex="" width={130} />
            <Column title="申请日期" dataIndex="" width={130} />
            <Column title="状态" dataIndex="" width={120} />
            <Column
              title="操作"
              width={150}
              lock="right"
              render={(value, record, index) => (
                <Space size="middle">
                  <a onClick={() => this.handleShowDetail(record)}>查看详情</a>
                  <a onClick={() => this.handleShowDetail(record)}>状态</a>
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
