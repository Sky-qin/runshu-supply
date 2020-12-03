import React from "react";
import { connect } from "dva";
import { Table, Button, Select, Input } from "antd";
import { OpreationBar, ContentBox } from "wrapd";
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
    if (key === "province" || key === "isPriceChanged") {
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
      isPriceChanged,
    } = this.props.sunshinePurchaseInfoModel;
    const { current, size, total } = pagination;
    return (
      <ContentBox loading={loading}>
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
              <Select
                onChange={(value) =>
                  this.onChangeFilter(value, "isPriceChanged")
                }
                style={{ width: "160px", marginLeft: "12px" }}
                options={[
                  { value: "是", label: "有价格变动" },
                  { value: "否", label: "无价格变动" },
                ]}
                value={isPriceChanged}
                placeholder="价格变化情况"
              />
              <Input
                style={{ width: "500px", marginLeft: "12px" }}
                placeholder={
                  province === "JI_LIN"
                    ? "请输入产品名称/产品编号/规格/型号/生产企业/医院名称"
                    : "请输入产品名称/产品编号/规格/型号/生产企业/中标企业"
                }
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
      </ContentBox>
    );
  }
}

export default connect(({ sunshinePurchaseInfoModel }) => ({
  sunshinePurchaseInfoModel,
}))(SunshinePurchaseInfo);
