import React from "react";
import { connect } from "dva";
import { Table, Input, Button } from "antd";
import { SearchOutlined, ExportOutlined } from "@ant-design/icons";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";

const { Column } = Table;
class ManufacturerManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "manufacturerManageModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.manufacturerManageModel;
    dispatch({
      type: "manufacturerManageModel/save",
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
    const { dispatch } = this.props;
    const { pagination } = this.props.manufacturerManageModel;
    dispatch({
      type: "manufacturerManageModel/save",
      payload: {
        [key]: value,
        pagination: {
          ...pagination,
          current: 1,
        },
      },
    });
    if (key === "keyword") return;

    this.getTableList();
  };

  render() {
    const {
      pagination,
      data,
      loading,
      keyword,
    } = this.props.manufacturerManageModel;
    const { current, size, total } = pagination;
    return (
      <ContentWrap loading={loading}>
        <OpreationBar
          custom={
            <>
              <div
                style={{ width: 260, display: "inline-block", marginRight: 15 }}
              >
                <Input
                  style={{ width: 225 }}
                  placeholder="输入生产厂家名称"
                  value={keyword}
                  onChange={(e) =>
                    this.onChangeFilter(e.target.value, "keyword")
                  }
                  allowClear
                />
                <Button
                  style={{ position: "relative", left: "-3px", top: "1px" }}
                  onClick={this.getTableList}
                  icon={<SearchOutlined />}
                />
              </div>
            </>
          }
          linkList={[
            {
              key: "export",
              label: "导出",
              icon: <ExportOutlined />,
              params: { keyword },
              url: "/supply/vendor/export",
            },
          ]}
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
          <Column title="生产厂家编码" dataIndex="vendorCode" />
          <Column title="生产厂家名称" dataIndex="vendorName" />
        </Table>
      </ContentWrap>
    );
  }
}

export default connect(({ manufacturerManageModel }) => ({
  manufacturerManageModel,
}))(ManufacturerManage);
