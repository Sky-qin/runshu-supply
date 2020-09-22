import React from "react";
import { Modal, Form, Button, Select, InputNumber } from "antd";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class EditDialog extends React.Component {
  departmentRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      showEditDialog: false,
    };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    const { onOk } = this.props;
    let formObj = this.departmentRef;
    formObj.current
      .validateFields()
      .then((values) => {
        onOk && typeof onOk === "function" && onOk(values);
      })
      .catch((errorInfo) => {
        console.log("errorInfo", errorInfo);
        return;
      });
  };

  handleCancel = (e) => {
    const { onClosed } = this.props;
    onClosed && typeof onClosed === "function" && onClosed();
  };

  handleSearchProduct = (keyword, key) => {
    const { onSearch } = this.props;
    let { current: searchForm } = this.departmentRef;
    let stockId = searchForm.getFieldValue("stockId");
    onSearch &&
      typeof onSearch === "function" &&
      onSearch({ keyword, stockId }, key);
  };

  changeStock = (value) => {
    const { onSearch } = this.props;
    let { current: searchForm } = this.departmentRef;

    if (value) {
      onSearch &&
        typeof onSearch === "function" &&
        onSearch({ keyword: "", stockId: value }, "product");
    } else {
      searchForm.setFieldsValue({
        productCode: null,
      });
      onSearch &&
        typeof onSearch === "function" &&
        onSearch({ keyword: "", stockId: value }, "empty");
    }
  };

  render() {
    const { title, data, loading, sourceList } = this.props;
    const { productList, stockList } = sourceList;
    return (
      <Modal
        title={title || "编辑"}
        visible
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={[
          <Button key="cancel" onClick={this.handleCancel}>
            取消
          </Button>,
          <Button
            key="ok"
            type="primary"
            loading={loading}
            onClick={this.handleOk}
          >
            确定
          </Button>,
        ]}
      >
        <Form
          {...layout}
          ref={this.departmentRef}
          layout="horizontal"
          initialValues={{
            productCode: data.productCode,
            value: data.stockValue,
            stockId: data.stockId,
          }}
        >
          <Form.Item
            name="stockId"
            label="选择库位"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              showArrow={false}
              filterOption={false}
              options={stockList}
              placeholder="请选择库位"
              onChange={this.changeStock}
              allowClear
              disabled={title === "编辑" ? true : false}
            />
          </Form.Item>
          <Form.Item
            name="productCode"
            label="选择产品"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              showArrow={false}
              filterOption={false}
              onSearch={(value) => this.handleSearchProduct(value, "product")}
              options={productList}
              placeholder="请选择商品"
              allowClear
              disabled={title === "编辑" ? true : false}
            />
          </Form.Item>
          <Form.Item
            name="value"
            label="临界值设置"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default EditDialog;
