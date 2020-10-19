import React from "react";
import { Modal, Form, Select, Button, Switch } from "antd";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class EditDialog extends React.Component {
  departmentRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      stockId: false,
    };
  }

  handleOk = (e) => {
    const { onOk } = this.props;
    const { stockId, stockMsg } = this.state;
    let formObj = this.departmentRef;
    formObj.current
      .validateFields()
      .then(() => {
        onOk && typeof onOk === "function" && onOk(stockMsg);
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

  renderFooter = () => {
    const { lock } = this.state;
    const { loading } = this.props;
    if (!lock) {
      return false;
    }
    if (lock) {
      return [
        <Button
          key="ok"
          type="primary"
          loading={loading}
          onClick={this.handleOk}
        >
          下一步
        </Button>,
      ];
    }
  };

  changeSwitch = (value) => {
    const { stockId } = this.state;
    const { onLock } = this.props;
    onLock &&
      typeof onLock === "function" &&
      onLock(stockId, () => this.setState({ lock: value }));
  };

  render() {
    const { title, data } = this.props;
    const { storageList } = data;
    const { stockId, lock } = this.state;
    return (
      <Modal
        title={title}
        visible
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={this.renderFooter()}
      >
        <Form {...layout} ref={this.departmentRef} layout="horizontal">
          <Form.Item
            name="stockId"
            label="盘点库位"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="请选择要盘点的库位"
              options={storageList}
              onChange={(value, obj) => {
                let { current: searchForm } = this.departmentRef;
                this.setState({ stockId: value || null, stockMsg: { ...obj } });
                if (value) {
                  searchForm.setFieldsValue({ lock: obj.isLock || false });
                  this.setState({ lock: obj.isLock || false });
                } else {
                  searchForm.setFieldsValue({ lock: false });
                  this.setState({ lock: false });
                }
              }}
              allowClear
            />
          </Form.Item>
          <Form.Item label="是否已锁定">
            <Switch
              checked={lock}
              disabled={!stockId}
              onChange={this.changeSwitch}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default EditDialog;
