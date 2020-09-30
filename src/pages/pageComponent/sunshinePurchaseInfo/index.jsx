import React from "react";
import { connect } from "dva";
import { Table, Button, Select, Input } from "antd";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";
import "./index.scss";

class SunshinePurchaseInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "sunshinePurchaseInfoModel/getProvinceList" });
    dispatch({ type: "sunshinePurchaseInfoModel/getSunTitle" });

    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "sunshinePurchaseInfoModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.sunshinePurchaseInfoModel;
    dispatch({
      type: "sunshinePurchaseInfoModel/save",
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
      type: "sunshinePurchaseInfoModel/save",
      payload: {
        [key]: value,
        pagination: {
          ...pagination,
          current: 1,
        },
      },
    });
    if (key === "province") {
      dispatch({ type: "sunshinePurchaseInfoModel/getSunTitle" });
      this.getTableList();
    }
  };

  render() {
    const {
      pagination,
      data,
      loading,
      provinceList,
      tableTitle,
      province,
      keyword,
    } = this.props.sunshinePurchaseInfoModel;
    const { current, size, total } = pagination;
    return (
      <ContentWrap loading={loading}>
        <OpreationBar
          custom={
            <>
              <Select
                showSearch
                onChange={(value) => this.onChangeFilter(value, "province")}
                style={{ width: 260 }}
                options={provinceList}
                value={province}
                placeholder="请选择区域"
              />
              <Input
                style={{ width: "500px", marginLeft: "12px" }}
                placeholder="请输入产品名称/产品编号/规格/型号/生产企业"
                value={keyword}
                onChange={(e) => this.onChangeFilter(e.target.value, "keyword")}
                allowClear
              />
              <Button
                type="primary"
                style={{ position: "relative", left: "-3px" }}
                onClick={this.getTableList}
              >
                查询
              </Button>
            </>
          }
          total={total}
        />
        <Table
          bordered
          rowKey={(record, index) => index}
          columns={tableTitle}
          dataSource={data}
          scroll={{ x: 1800 }}
          pagination={{
            position: ["bottomCenter"],
            current: current,
            total: total || 0,
            pageSize: size,
            onChange: this.changePagination,
            onShowSizeChange: this.changePagination,
          }}
        />
      </ContentWrap>
    );
  }
}

export default connect(({ sunshinePurchaseInfoModel }) => ({
  sunshinePurchaseInfoModel,
}))(SunshinePurchaseInfo);
