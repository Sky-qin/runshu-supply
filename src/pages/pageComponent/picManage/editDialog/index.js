import React from "react";
import { Modal, Form, Button, Select, Radio } from "antd";
import { Prefix, PicPrefix } from "../../../../utils/config";
import Avatar from "../uploadPic";

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
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      this.getBase64(info.file.originFileObj, (imageUrl) =>
        this.setState({
          imageUrl,
          loading: false,
        })
      );
    }
  };

  render() {
    const { title, data, loading, sourceList } = this.props;
    const { categoryList, productVendorList, productNameList } = sourceList;
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
            productCategory: data.productCategory || null,
            productVendor: (data.productVendor || "").toString() || null,
            productName: data.productName || null,
            imageUrl: data.imageUrl,
            isDefault: data.isDefault,
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
            name="isDefault"
            label="默认图片"
            rules={[{ required: true }]}
          >
            <Radio.Group
              onChange={(e) =>
                this.handleChangeForm(e.target.value, "isDefault")
              }
              disabled={!!data.id}
            >
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>

          {data.isDefault === false && (
            <>
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
                  disabled={!!data.id || !data.productCategory}
                />
              </Form.Item>
              <Form.Item
                name="productName"
                label="产品名称"
                rules={[{ required: true }]}
              >
                <Select
                  dropdownMatchSelectWidth={false}
                  showSearch
                  optionFilterProp="label"
                  options={productNameList}
                  placeholder="请选择"
                  onChange={(value) =>
                    this.handleChangeForm(value, "productName")
                  }
                  disabled={
                    !!data.id || !data.productCategory || !data.productVendor
                  }
                />
              </Form.Item>
            </>
          )}
          <Form.Item
            name="imageUrl"
            label="封面图"
            rules={[{ required: true }]}
          >
            <Avatar
              path={Prefix}
              picpath={PicPrefix}
              imageUrl={data.imageUrl}
              onChange={(value) => this.handleChangeForm(value, "imageUrl")}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default EditDialog;
