import React from "react";
import { connect } from "dva";
import { Space, Table, Input, Tabs } from "antd";
import EditDialog from "./editDialog";
import ContentWrap from "../../../components/contentWrap";
import "./index.scss";

const { Column } = Table;
const { Search } = Input;
const { TabPane } = Tabs;

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

  changeTabValue = (value) => {
    const { dispatch } = this.props;
    const { activeTabKey, pagination } = this.props.replenishmentModel;
    dispatch({
      type: "replenishmentModel/save",
      payload: {
        activeTabKey: value,
        pagination: {
          ...pagination,
          current: 1,
        },
      },
    });
    this.getTableList();
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
      tabList,
      activeTabKey,
    } = this.props.replenishmentModel;
    const { current, size, total } = pagination;
    return (
      <ContentWrap loading={loading}>
        <div className="opreation-bar">
          <div>
            <Search
              placeholder="请输入补货单号"
              onSearch={(value) => this.onChangeFilter("consumeName", value)}
              // value={searchParams.consumeName || null}
              style={{ width: 260 }}
            />
          </div>
        </div>
        <Tabs defaultActiveKey={activeTabKey} onChange={this.changeTabValue}>
          {(tabList || []).map((item) => {
            return (
              <TabPane tab={item.label} key={item.value}>
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
                        <a onClick={() => this.handleShowDetail(record)}>
                          查看详情
                        </a>
                        <a onClick={() => this.handleShowDetail(record)}>
                          状态
                        </a>
                      </Space>
                    )}
                  />
                </Table>
              </TabPane>
            );
          })}
        </Tabs>

        {/* 编辑弹窗 */}
        {showDetailDialog && (
          <EditDialog
            title="库存详情"
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
    );
  }
}

export default connect(({ replenishmentModel }) => ({
  replenishmentModel,
}))(Replenishment);
