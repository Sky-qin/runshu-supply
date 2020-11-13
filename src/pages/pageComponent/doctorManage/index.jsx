import React from "react";
import { connect } from "dva";
import { Space, Table } from "antd";
import AddPersonDialog from "./addPersonDialog";
import DeletePersonDialog from "./deletePersonDialog";
import ContentWrap from "../../../components/contentWrap";
import "./index.scss";

const { Column } = Table;

class DoctorManage extends React.Component {
  searchRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "doctorManageModel/getTableList",
    });
  };

  handleAddPerson = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "doctorManageModel/save",
      payload: {
        currentMsg: { ...msg },
        showAddPersonDialog: true,
      },
    });
  };

  expandedRowRender = (record) => {
    const { doctorList } = record;
    if (doctorList && doctorList.length === 0) return;
    const columns = [
      { title: "医生姓名", dataIndex: "doctorName", key: "doctorName" },
      { title: "创建时间", dataIndex: "createTime", key: "createTime" },
      {
        title: "操作",
        key: "operation",
        width: 120,
        render: (value, record, index) => (
          <Space>
            <a onClick={() => this.handleDelete(record)}>删除</a>
          </Space>
        ),
      },
    ];

    return (
      <Table
        bordered
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={doctorList || []}
        pagination={false}
      />
    );
  };

  handleDelete = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "doctorManageModel/save",
      payload: {
        showDeleteDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  handleSavePerson = (values) => {
    const { dispatch, doctorManageModel } = this.props;
    const { currentMsg } = doctorManageModel;
    dispatch({
      type: "doctorManageModel/addPerson",
      payload: {
        ...values,
        hospitalId: currentMsg.hospitalId,
      },
    });
  };

  handleDeletePerson = () => {
    const { dispatch } = this.props;
    dispatch({ type: "doctorManageModel/doctorDelete" });
  };

  changePagination = (current, size) => {
    const { dispatch } = this.props;
    dispatch({
      type: "doctorManageModel/save",
      payload: {
        current,
        size,
      },
    });
    this.getTableList();
  };

  render() {
    const { dispatch } = this.props;
    const {
      showAddPersonDialog,
      showDeleteDialog,
      currentMsg,
      data,
      loading,
      dialogBtnLoading,
      current,
      total,
      size,
    } = this.props.doctorManageModel;
    console.log("total", total);
    return (
      <ContentWrap loading={loading}>
        <Table
          bordered
          rowKey={(record) => record.hospitalId}
          dataSource={data}
          expandable={{ expandedRowRender: this.expandedRowRender }}
          pagination={{
            position: ["bottomCenter"],
            current: current,
            total: total || 0,
            pageSize: size,
            onChange: this.changePagination,
            onShowSizeChange: this.changePagination,
          }}
        >
          <Column title="医院" dataIndex="hospitalName" />
          <Column
            title="操作"
            width={120}
            fixed="right"
            render={(value, record, index) => (
              <Space size="middle">
                <a onClick={() => this.handleAddPerson(record)}>添加人员</a>
              </Space>
            )}
          />
        </Table>

        {showAddPersonDialog && (
          <AddPersonDialog
            title="医院添加医生"
            loading={dialogBtnLoading}
            data={currentMsg}
            onClosed={() => {
              dispatch({
                type: "doctorManageModel/save",
                payload: {
                  showAddPersonDialog: false,
                  dialogBtnLoading: false,
                },
              });
            }}
            onOk={this.handleSavePerson}
          />
        )}

        {showDeleteDialog && (
          <DeletePersonDialog
            title="提示"
            loading={dialogBtnLoading}
            data={currentMsg}
            onClosed={() => {
              dispatch({
                type: "doctorManageModel/save",
                payload: {
                  showDeleteDialog: false,
                  dialogBtnLoading: false,
                },
              });
            }}
            onOk={this.handleDeletePerson}
          />
        )}
      </ContentWrap>
    );
  }
}

export default connect(({ doctorManageModel }) => ({
  doctorManageModel,
}))(DoctorManage);
