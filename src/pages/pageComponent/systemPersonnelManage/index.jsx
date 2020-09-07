import React from "react";
import { connect } from "dva";
import { Table, Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import EditDialog from "./editDialog";
// import T from "prop-types";
import ContentBox from "../../../components/contentWrap";
// import style
import "./index.scss";
const { Column } = Table;

class SystemPersonnelManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditDialog: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "personnelManage/getAddress",
    });
    dispatch({
      type: "personnelManage/storageList",
    });
    dispatch({
      type: "personnelManage/departmentList",
    });
  }

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    const { pagination } = this.props.personnelManage;
    dispatch({
      type: "personnelManage/save",
      paylaod: {
        pagination: {
          ...pagination,
          current,
          size,
        },
      },
    });
  };

  handleAdd = (msg = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: "personnelManage/save",
      payload: {
        showEditDialog: true,
        currentMsg: { ...msg },
        dialogTitle: "新增",
      },
    });
  };

  handleEdit = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "personnelManage/save",
      payload: {
        showEditDialog: true,
        currentMsg: { ...msg },
        dialogTitle: "编辑",
      },
    });
  };

  render() {
    const { dispatch } = this.props;
    const {
      showEditDialog,
      pagination,
      dialogTitle,
      currentMsg,
      adressList,
      storageList,
      departmentList,
      loading,
    } = this.props.personnelManage;
    const { current, size, total } = pagination;
    return (
      <ContentBox loading={loading}>
        <div className="opreation-bar">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={this.handleAdd}
          >
            新增
          </Button>
        </div>
        <Table
          bordered
          rowKey={(record, index) => index}
          dataSource={[
            { name: "a", remark: "测试啊" },
            {
              name: "b",
              age: "21",
              departmentId: ["hospitalManage", "departmentManage"],
            },
          ]}
          pagination={{
            position: ["bottomCenter"],
            current,
            total,
            pageSize: size,
            onChange: this.changePagination,
            onShowSizeChange: this.changePagination,
          }}
        >
          <Column
            title="序号"
            render={(value, record, index) => index + 1}
            width={65}
          />
          <Column title="用户名" dataIndex="name" />
          <Column title="职位" dataIndex="department" />
          <Column title="创建日期" dataIndex="city" />
          <Column title="修改人" dataIndex="city" />
          <Column title="用户状态" dataIndex="city" />
          <Column
            title="操作"
            dataIndex="name"
            width={110}
            render={(value, record, index) => (
              <Space size="middle">
                <a onClick={() => this.handleEdit(record)}>编辑</a>
                <a>删除</a>
              </Space>
            )}
          />
        </Table>
        {showEditDialog && (
          <EditDialog
            title={dialogTitle}
            data={currentMsg}
            sourceList={{ adressList, storageList, departmentList }}
            onClosed={() => {
              dispatch({
                type: "personnelManage/save",
                payload: {
                  showEditDialog: false,
                },
              });
            }}
          />
        )}
      </ContentBox>
    );
  }
}

export default connect(({ personnelManage }) => ({
  personnelManage,
}))(SystemPersonnelManage);
