import React from "react";
import { Modal, Form, Button, Select } from "antd";

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
        itemId: null,
      });
      onSearch &&
        typeof onSearch === "function" &&
        onSearch({ keyword: "", stockId: value }, "empty");
    }
  };

  render() {
    const { title, data, loading, sourceList } = this.props;
    const { criticalType, productList, stockList } = sourceList;
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
            stockId: data.stockId,
            itemId: data.itemId,
            value: data.periodValue,
          }}
        >
          <Form.Item
            name="stockId"
            label="选择库位"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              showArrow={true}
              optionFilterProp="label"
              options={stockList}
              placeholder="请选择库位"
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
            label="临界值设置"
            rules={[{ required: true }]}
          >
            <Select
              options={criticalType}
              placeholder="请选择临界值"
              allowClear
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default EditDialog;
