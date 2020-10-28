import React from "react";
import { connect } from "dva";
import {
  Button,
  Space,
  Table,
  Modal,
  Input,
  Form,
  Col,
  Row,
  Select,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import EditDialog from "./editDialog";
import ContentWrap from "../../../components/contentWrap";
import OpreationBar from "../../../components/OpreationBar";
import "./index.scss";

const { Column } = Table;
const { Search } = Input;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

const tailLayout = {
  wrapperCol: {
    span: 24,
  },
};

class PicManage extends React.Component {
  searchRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "picManageModel/queryProductCategory" });
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "picManageModel/getTableList",
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
      type: "picManageModel/save",
      payload: {
        searchParams: {},
        productVendorList: [],
        productNameList: [],
      },
    });
    this.getTableList();
  };

  handleClick = (key) => {
    const { dispatch } = this.props;
    if (key === "add") {
      dispatch({
        type: "picManageModel/save",
        payload: {
          showEditDialog: true,
          currentMsg: {},
          dialogTitle: "新增",
        },
      });
    }
  };

  handleEdit = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "picManageModel/productVendorListbyCategory",
      payload: {
        productCategory: msg.productCategory,
      },
    });
    dispatch({
      type: "picManageModel/productNameList",
      payload: {
        productCategory: msg.productCategory,
        productVendor: msg.productVendor,
      },
    });
    dispatch({
      type: "picManageModel/save",
      payload: {
        showEditDialog: true,
        dialogTitle: "编辑",
        currentMsg: { ...msg },
      },
    });
  };

  handleDelete = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "picManageModel/save",
      payload: {
        deleteDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  handleSave = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: "picManageModel/saveImage",
      payload: { ...values },
    });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.picManageModel;
    dispatch({
      type: "picManageModel/save",
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

  handleCloseDeleteDialog = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "picManageModel/save",
      payload: {
        deleteDialog: false,
        dialogBtnLoading: false,
      },
    });
  };

  onFormChange = (value, key, callBack) => {
    const { dispatch, picManageModel } = this.props;
    const { currentMsg } = picManageModel;
    let tmp = { [key]: value };
    if (key === "productCategory") {
      dispatch({
        type: "picManageModel/productVendorListbyCategory",
        payload: {
          productCategory: value,
        },
      });
      tmp = { ...tmp, productCode: null, productVendor: null };
      callBack({ productVendor: null });
      callBack({ productCode: null });
    }
    if (key === "productVendor") {
      dispatch({
        type: "picManageModel/productNameList",
        payload: {
          productCategory: currentMsg.productCategory,
          productVendor: value,
        },
      });
      tmp = { ...tmp, productCode: null };
      callBack({ productCode: null });
    }

    dispatch({
      type: "picManageModel/save",
      payload: {
        currentMsg: { ...currentMsg, ...tmp },
      },
    });
  };

  onSearchChange = (key, value) => {
    const { dispatch } = this.props;
    const { searchParams, pagination } = this.props.picManageModel;
    let { current: searchForm } = this.searchRef;
    let tmpParams = { searchParams: { ...searchParams, [key]: value } };
    // 获取科室
    if (key === "productCategory") {
      tmpParams = {
        searchParams: {
          ...tmpParams.searchParams,
          productVendor: null,
          productCode: null,
        },
      };
      searchForm.setFieldsValue({ productVendor: null });
      searchForm.setFieldsValue({ productCode: null });

      if (value) {
        dispatch({
          type: "picManageModel/productVendorListbyCategory",
          payload: {
            productCategory: value,
          },
        });
      } else {
        tmpParams = {
          ...tmpParams,
          productVendorList: [],
          productNameList: [],
        };
      }
    }

    if (key === "productVendor") {
      dispatch({
        type: "picManageModel/productNameList",
        payload: {
          productCategory: searchParams.productCategory,
          productVendor: value,
        },
      });
      tmpParams = {
        searchParams: {
          ...tmpParams.searchParams,
          productCode: null,
        },
      };
      searchForm.setFieldsValue({ productCode: null });
    }

    dispatch({
      type: "picManageModel/save",
      payload: {
        ...tmpParams,
        pagination: {
          ...pagination,
          current: 1,
        },
      },
    });
    // this.getTableList();
  };

  filterChange = (value, key) => {
    const { dispatch } = this.props;
    dispatch({
      type: "picManageModel/save",
      payload: {
        [key]: value,
      },
    });
    if (key === "keyword") return;
    this.getTableList();
  };

  render() {
    const { dispatch } = this.props;
    const {
      showEditDialog,
      dialogTitle,
      currentMsg,
      deleteDialog,
      pagination,
      data,
      loading,
      dialogBtnLoading,
      categoryList,
      productVendorList,
      productNameList,
      searchParams,
    } = this.props.picManageModel;
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
                <Form.Item label="产品分类" name="productCategory">
                  <Select
                    onChange={(value) =>
                      this.onSearchChange("productCategory", value)
                    }
                    options={categoryList}
                    placeholder="请选择"
                    dropdownMatchSelectWidth={false}
                    showSearch
                    optionFilterProp="label"
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="生产厂家" name="productVendor">
                  <Select
                    onChange={(value) =>
                      this.onSearchChange("productVendor", value)
                    }
                    placeholder="请选择"
                    options={productVendorList}
                    value={searchParams.productVendor || null}
                    dropdownMatchSelectWidth={false}
                    showSearch
                    optionFilterProp="label"
                    disabled={!searchParams.productCategory}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="产品名称" name="productCode">
                  <Select
                    placeholder="请选择"
                    options={productNameList}
                    dropdownMatchSelectWidth={false}
                    showSearch
                    optionFilterProp="label"
                    disabled={!searchParams.productVendor}
                    onChange={(value) =>
                      this.onSearchChange("productCode", value)
                    }
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
            buttonList={[{ key: "add", label: "新增", icon: <PlusOutlined /> }]}
            total={total}
            onClick={this.handleClick}
          />
          <Table
            bordered
            rowKey={(record, index) => index}
            dataSource={data}
            scroll={{ x: 1300 }}
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
            <Column
              title="封面图"
              dataIndex="imageUrl"
              width={120}
              render={(value) => {
                return (
                  <img
                    width={80}
                    src={`https://filesystem.runshutech.com/${value}`}
                  />
                );
              }}
            />
            <Column title="产品名称" dataIndex="productName" />
            <Column
              title="产品类别"
              dataIndex="productCategoryName"
              width={120}
            />
            <Column title="生产厂家" dataIndex="productVendorName" />
            <Column
              title="操作"
              width={120}
              fixed="right"
              render={(value, record, index) => (
                <Space size="middle">
                  <a onClick={() => this.handleEdit(record)}>编辑</a>
                  <a onClick={() => this.handleDelete(record)}>删除</a>
                </Space>
              )}
            />
          </Table>

          {/* 删除弹窗 */}
          <Modal
            title="提示"
            visible={deleteDialog}
            onCancel={this.handleCloseDeleteDialog}
            footer={[
              <Button key="cancel" onClick={this.handleCloseDeleteDialog}>
                取消
              </Button>,
              <Button
                key="ok"
                type="primary"
                loading={dialogBtnLoading}
                onClick={() => {
                  dispatch({
                    type: "picManageModel/deleteImage",
                  });
                }}
              >
                确定
              </Button>,
            ]}
            maskClosable={false}
          >
            你确定要删除商品图片嘛？
          </Modal>
          {/* 编辑弹窗 */}
          {showEditDialog && (
            <EditDialog
              title={dialogTitle}
              data={currentMsg}
              sourceList={{ categoryList, productVendorList, productNameList }}
              loading={dialogBtnLoading}
              onFormChange={this.onFormChange}
              onClosed={() => {
                dispatch({
                  type: "picManageModel/save",
                  payload: {
                    showEditDialog: false,
                    dialogBtnLoading: false,
                  },
                });
              }}
              onOk={this.handleSave}
            />
          )}
        </ContentWrap>
      </>
    );
  }
}

export default connect(({ picManageModel }) => ({
  picManageModel,
}))(PicManage);
