import React from "react";
import { connect } from "dva";
import { Modal, Table } from "antd";

const { Column } = Table;

class EditDialog extends React.Component {
  departmentRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { onClosed } = this.props;
    onClosed && typeof onClosed === "function" && onClosed();
  };

  handleEdit = (msg, text, status) => {
    const { dispatch } = this.props;
    dispatch({
      type: "consumeModel/save",
      payload: {
        clickStatus: status,
        statusTitle: text,
        showStatusDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  render() {
    const { title, data } = this.props;
    const { productInventoryList } = data;
    return (
      <Modal
        title={title}
        visible
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={false}
        style={{ minWidth: "1000px", maxWidth: "1100px" }}
      >
        <Table
          bordered
          dataSource={productInventoryList}
          rowKey={(record, index) => index}
          pagination={false}
          scroll={{ y: 450 }}
        >
          <Column
            title="序号"
            render={(value, record, index) => index + 1}
            width={100}
          />
          <Column title="商品名称" dataIndex="productName" />
          <Column title="商品数量" dataIndex="amount" width={100} />
          <Column title="库位名称" dataIndex="stockName" />
        </Table>
      </Modal>
    );
  }
}

export default connect(({ consumeModel }) => ({
  consumeModel,
}))(EditDialog);
