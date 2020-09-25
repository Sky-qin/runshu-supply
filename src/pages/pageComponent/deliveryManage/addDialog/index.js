import React from "react";
import { connect } from "dva";
import { Modal, Button, Table, Form, Select, Row, Col } from "antd";

const { Column } = Table;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class AddDialog extends React.Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  handleCancel = () => {
    const { onClosed } = this.props;
    onClosed && typeof onClosed === "function" && onClosed();
  };

  handleOk = (e) => {
    const { onOk } = this.props;
    const { selectedRowKeys } = this.state;
    let formObj = this.formRef;
    formObj.current
      .validateFields()
      .then(() => {
        onOk && typeof onOk === "function" && onOk(selectedRowKeys);
      })
      .catch((errorInfo) => {
        console.log("errorInfo", errorInfo);
        return;
      });
  };

  changePagination = (current, size) => {
    const { hospitalId } = this.state;
    const { onChange } = this.props;
    onChange &&
      typeof onChange === "function" &&
      onChange(current, size, hospitalId);
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  changeTableList = (value) => {
    const { onChange } = this.props;

    this.setState({ hospitalId: value, selectedRowKeys: [] });
    onChange && typeof onChange === "function" && onChange(1, 50, value);
  };

  render() {
    const { selectedRowKeys, hospitalId } = this.state;
    const { title, data } = this.props;
    const {
      hospitalList,
      inventoryPagination,
      loading,
      replenishTodoList,
    } = data;
    return (
      <Modal
        title={title}
        visible
        style={{ minWidth: "1000px", maxWidth: "1100px" }}
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={[
          <Button key="cancel" loading={loading} onClick={this.handleCancel}>
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
          ref={this.formRef}
          layout="horizontal"
          initialValues={{
            name: data.name,
          }}
        >
          <Row>
            <Col span={10}>
              <Form.Item
                name="name"
                label="医院："
                rules={[{ required: true }]}
              >
                <Select
                  showArrow
                  options={hospitalList}
                  onChange={(value) => this.changeTableList(value)}
                  showSearch
                  optionFilterProp="label"
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table
          bordered
          scroll={{ y: 400 }}
          dataSource={replenishTodoList}
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: (record) => ({
              disabled: !hospitalId,
            }),
          }}
          pagination={{
            position: ["bottomCenter"],
            current: inventoryPagination.current,
            total: inventoryPagination.total || 0,
            pageSize: inventoryPagination.size,
            onChange: this.changePagination,
            onShowSizeChange: this.changePagination,
          }}
        >
          <Column title="申请日期" dataIndex="replenishTime" width={130} />
          <Column title="补货单号" dataIndex="replenishOrder" width={150} />
          <Column title="客户" dataIndex="customer" width={120} />
          <Column title="状态" dataIndex="orderStatusLabel" width={120} />
          <Column title="补货数量" dataIndex="replenishNum" width={100} />
          <Column title="已补数量" dataIndex="deliverNum" width={100} />
          <Column title="未补数量" dataIndex="waitNum" width={100} />
        </Table>
      </Modal>
    );
  }
}

export default connect(({ consumeModel }) => ({
  consumeModel,
}))(AddDialog);
