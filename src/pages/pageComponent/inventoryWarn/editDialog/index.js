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

  // showModal = () => {
  //   this.setState({
  //     visible: true,
  //     maxStockValue:
  //       (this.props.data && this.props.data.maxStockValue) ||
  //       Number.MAX_SAFE_INTEGER,
  //     minStockValue: (this.props.data && this.props.data.value) || 0,
  //   });
  // };

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
        itemId: null,
      });
      onSearch &&
        typeof onSearch === "function" &&
        onSearch({ keyword: "", stockId: value }, "empty");
    }
  };

  render() {
    const { title, data, loading, sourceList } = this.props;
    const { productList, stockList } = sourceList;
    const { minStockValue } = this.state;
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
            itemId: data.itemId,
            value: data.stockValue,
            stockId: data.stockId,
            maxStockValue: data.maxStockValue,
          }}
        >
          <Form.Item
            name="stockId"
            label="选择库位"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              options={stockList}
              placeholder="请选择库位"
              optionFilterProp="label"
              onChange={this.changeStock}
              allowClear
              disabled={title === "编辑" ? true : false}
            />
          </Form.Item>
          <Form.Item
            name="itemId"
            label="选择产品"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              showArrow={true}
              filterOption={false}
              dropdownMatchSelectWidth={false}
              onSearch={(value) => this.handleSearchProduct(value, "product")}
              options={productList}
              placeholder="请输入选择商品"
              allowClear
              disabled={title === "编辑" ? true : false}
            />
          </Form.Item>
          <Form.Item
            name="value"
            label="低库存预警值"
            rules={[{ required: true }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              onBlur={(e) => {
                this.setState({
                  minStockValue: Number(e.target.value || 0),
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="maxStockValue"
            label="高库存预警值"
            rules={[{ required: true }]}
          >
            <InputNumber
              min={minStockValue > 0 ? 1 + minStockValue : 1}
              style={{ width: "100%" }}
              // onBlur={(e) => {
              //   this.setState({
              //     maxStockValue: e.target.value || Number.MAX_SAFE_INTEGER,
              //   });
              // }}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default EditDialog;
