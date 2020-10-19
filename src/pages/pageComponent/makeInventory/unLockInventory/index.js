import React from "react";
import { Modal, Button, Table } from "antd";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const Column = Table.Column;

class UnLockInventory extends React.Component {
  departmentRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      showEditDialog: false,
    };
  }

  handleCancel = (e) => {
    const { onClosed } = this.props;
    onClosed && typeof onClosed === "function" && onClosed();
  };

  unLock = (msg) => {
    const { onUnLock } = this.props;
    onUnLock && typeof onUnLock === "function" && onUnLock(msg);
  };

  render() {
    const { title, data, loading } = this.props;
    const { lockStockList } = data;
    return (
      <Modal
        title={title}
        visible
        style={{ minWidth: "650px", maxWidth: "650px", height: "600px" }}
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={false}
      >
        <Table
          bordered
          scroll={{ y: 400 }}
          dataSource={lockStockList || []}
          loading={loading}
          rowKey="value"
          pagination={false}
        >
          <Column
            title="序号"
            render={(value, record, index) => index + 1}
            width={65}
          />
          <Column title="仓库名称" dataIndex="label" />
          <Column
            title="状态"
            dataIndex="isLock"
            width={100}
            render={() => {
              return "锁定";
            }}
          />
          <Column
            title="操作"
            width={80}
            render={(value, record, index) => (
              <a onClick={() => this.unLock(record)}>解锁</a>
            )}
          />
        </Table>
      </Modal>
    );
  }
}

export default UnLockInventory;
