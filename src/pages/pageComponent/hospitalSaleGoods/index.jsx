import React from "react";
import { connect } from "dva";
import { Table, Select, Input, Form, Button, Row, Col } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";
// import "./index.scss";

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

class HospitalSaleGoods extends React.Component {
  searchRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "hospitalSaleGoodsModel/getHospital",
    });
    this.getTableList();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: "hospitalSaleGoodsModel/save",
      payload: {
        searchParams: {},
      },
    });
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "hospitalSaleGoodsModel/getTableList",
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.hospitalSaleGoodsModel;
    dispatch({
      type: "hospitalSaleGoodsModel/save",
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
    const { searchParams, pagination } = this.props.hospitalSaleGoodsModel;
    let tmpParams = { searchParams: { ...searchParams, [key]: value } };
    dispatch({
      type: "hospitalSaleGoodsModel/save",
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
      type: "hospitalSaleGoodsModel/save",
      payload: {
        searchParams: {},
        departmentList: [],
      },
    });
    this.getTableList();
  };

  render() {
    const {
      pagination,
      data,
      loading,
      hospitalList,
      searchParams,
    } = this.props.hospitalSaleGoodsModel;
    const { current, size, total } = pagination;
    return (
      <div>
        <ContentWrap>
          <Form
            {...layout}
            ref={this.searchRef}
            onFinish={this.onFinish}
            style={{ marginTop: "24px" }}
          >
            <Row>
              <Col span={6}>
                <Form.Item label="产品名称/编码" name="keyword">
                  <Input
                    placeholder="请输入"
                    onChange={(e) =>
                      this.onSearchChange("keyword", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="医院" name="stockId">
                  <Select
                    onChange={(value) => this.onSearchChange("stockId", value)}
                    options={hospitalList}
                    placeholder="请选择"
                    dropdownMatchSelectWidth={false}
                    showSearch
                    optionFilterProp="label"
                    allowClear
                  />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="是否在售" name="onsale">
                  <Select
                    placeholder="请选择"
                    options={[
                      { value: 1, label: "是" },
                      { value: 0, label: "否" },
                    ]}
                    onChange={(value) => this.onSearchChange("onsale", value)}
                    allowClear
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
            linkList={[
              {
                key: "export",
                label: "导出",
                icon: <ExportOutlined />,
                params: searchParams,
                url: "/product/hospitalOnsale/export",
              },
            ]}
            total={total}
          />
          <Table
            bordered
            rowKey={(record, index) => index}
            dataSource={data}
            scroll={{ x: 1600 }}
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
              width={70}
            />
            <Column title="医院名称" dataIndex="hospitalName" width={160} />
            <Column
              title="是否在售"
              dataIndex="onsale"
              width={100}
              render={(value) => {
                return <span>{value ? "是" : "否"}</span>;
              }}
            />
            <Column title="产品名称" dataIndex="productName" width={160} />
            <Column title="产品简称" dataIndex="productShortName" width={120} />
            <Column title="产品编码" dataIndex="productCode" width={100} />

            <Column title="规格" dataIndex="regularModel" width={100} />
            <Column title="型号" dataIndex="model" width={100} />
            <Column title="单位" dataIndex="unitName" width={80} />
            <Column title="产品属性" dataIndex="productProperty" width={120} />
            <Column title="产品类别" dataIndex="productCategory" width={120} />
            <Column title="单价" dataIndex="productPrice" width={100} />
            <Column
              title="生产厂家"
              dataIndex="productVendorName"
              width={130}
            />
            <Column title="注册证号" dataIndex="registrationNo" width={120} />
            <Column
              title="生产许可证号"
              dataIndex="productLicenseNo"
              width={120}
            />
          </Table>
        </ContentWrap>
      </div>
    );
  }
}

export default connect(({ hospitalSaleGoodsModel }) => ({
  hospitalSaleGoodsModel,
}))(HospitalSaleGoods);
