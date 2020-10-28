import React from "react";
import { Modal, Form, Button, Select, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

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

  handleChangeForm = (value, key) => {
    let { current: searchForm } = this.departmentRef;
    const { onFormChange } = this.props;
    onFormChange &&
      typeof onFormChange === "function" &&
      onFormChange(value, key, searchForm.setFieldsValue);
  };

  handleChangeImg = (info) => {
    console.log("info", info);
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, (imageUrl) =>
        this.setState({
          imageUrl,
          loading: false,
        })
      );
    }
  };

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  render() {
    const { title, data, loading, sourceList } = this.props;
    const { categoryList, productVendorList, productNameList } = sourceList;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
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
            productCategory: data.productCategory,
            value: data.periodValue,
          }}
        >
          <Form.Item
            name="productCategory"
            label="产品类别"
            rules={[{ required: true }]}
          >
            <Select
              options={categoryList}
              dropdownMatchSelectWidth={false}
              showSearch
              optionFilterProp="label"
              placeholder="请选择"
              onChange={(value) =>
                this.handleChangeForm(value, "productCategory")
              }
              disabled={!!data.id}
            />
          </Form.Item>
          <Form.Item
            name="productVendor"
            label="生产厂家"
            rules={[{ required: true }]}
          >
            <Select
              options={productVendorList}
              dropdownMatchSelectWidth={false}
              showSearch
              optionFilterProp="label"
              placeholder="请选择"
              onChange={(value) =>
                this.handleChangeForm(value, "productVendor")
              }
              disabled={!!data.id}
            />
          </Form.Item>
          <Form.Item
            name="productCode"
            label="产品名称"
            rules={[{ required: true }]}
          >
            <Select
              dropdownMatchSelectWidth={false}
              showSearch
              optionFilterProp="label"
              options={productNameList}
              placeholder="请选择"
              onChange={(value) => this.handleChangeForm(value, "productCode")}
              disabled={!!data.id}
            />
          </Form.Item>
          {/* <Form.Item
            name="productCode"
            label="产品名称"
            rules={[{ required: true }]}
          >
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://order.runshutech.com/file/upload"
              // beforeUpload={beforeUpload}
              onChange={this.handleChangeImg}
            >
              {data.imageUrl ? (
                <img
                  src={`https://filesystem.runshutech.com/group1/${data.imageUrl}`}
                  alt="avatar"
                  style={{ width: "100%" }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item> */}
        </Form>
      </Modal>
    );
  }
}

export default EditDialog;
