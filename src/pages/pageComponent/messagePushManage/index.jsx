import React from "react";
import { connect } from "dva";
import { Space, Table, Tabs } from "antd";
import { ContentBox } from "wrapd";
import AddTypeDialog from "./addTypeDialog";
import AddPersonDialog from "./addPersonDialog";
import DeletePersonDialog from "./deletePersonDialog";
import "./index.scss";

const { Column } = Table;
const { TabPane } = Tabs;

class MessagePushManage extends React.Component {
  searchRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({ type: "messagePushModel/selectPushMessageType" });
    dispatch({
      type: "messagePushModel/selectAllSysUser",
      payload: { userName: "" },
    });
    this.getTableList();
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "messagePushModel/getTableList",
    });
  };

  handleAddPerson = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "messagePushModel/save",
      payload: {
        currentMsg: { ...msg },
        showAddPersonDialog: true,
      },
    });
  };

  expandedRowRender = (record) => {
    const { userList } = record;
    if (userList && userList.length === 0) return;
    const columns = [
      { title: "姓名", dataIndex: "userName", key: "userName" },
      { title: "手机号", dataIndex: "mobilePhone", key: "mobilePhone" },
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
        dataSource={userList || []}
        pagination={false}
      />
    );
  };

  changeTab = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: "messagePushModel/save",
      payload: {
        pushInfoType: value,
      },
    });

    this.getTableList();
  };

  // handleClickOpreation = (key) => {
  //   const { dispatch } = this.props;
  //   if (key === "add") {
  //     dispatch({
  //       type: "messagePushModel/save",
  //       payload: {
  //         showAddTypeDialog: true,
  //       },
  //     });
  //   }
  // };

  handleDelete = (msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: "messagePushModel/save",
      payload: {
        showDeleteDialog: true,
        currentMsg: { ...msg },
      },
    });
  };

  getPersonList = (userName) => {
    const { dispatch } = this.props;
    dispatch({
      type: "messagePushModel/selectAllSysUser",
      payload: { userName },
    });
  };

  handleSaveType = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: "messagePushModel/addType",
      payload: {
        ...values,
      },
    });
  };

  handleSavePerson = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: "messagePushModel/addPerson",
      payload: {
        ...values,
      },
    });
  };

  handleDeletePerson = () => {
    const { dispatch } = this.props;
    dispatch({ type: "messagePushModel/deletePushUser" });
  };

  render() {
    const { dispatch } = this.props;
    const {
      showAddTypeDialog,
      showAddPersonDialog,
      showDeleteDialog,
      currentMsg,
      data,
      loading,
      personList,
      pushInfoTypeList,
      pushInfoType,
      dialogBtnLoading,
    } = this.props.messagePushModel;
    return (
      <ContentBox loading={loading}>
        <Tabs defaultActiveKey={pushInfoType} onChange={this.changeTab}>
          {(pushInfoTypeList || []).map((item, index) => {
            return (
              <TabPane tab={item.pushModuleName} key={item.pushModule}>
                {/* <OpreationBar
                  buttonList={[
                    {
                      key: "add",
                      label: "新增推送消息",
                      icon: <PlusOutlined />,
                    },
                  ]}
                  onClick={this.handleClickOpreation}
                  total={false}
                /> */}
                <Table
                  bordered
                  rowKey={(record) => record.id}
                  dataSource={data}
                  expandable={{ expandedRowRender: this.expandedRowRender }}
                  pagination={false}
                >
                  <Column title="消息类型" dataIndex="pushNode" />
                  <Column title="更新时间" dataIndex="createTime" />
                  <Column
                    title="操作"
                    width={120}
                    fixed="right"
                    render={(value, record, index) => (
                      <Space size="middle">
                        <a onClick={() => this.handleAddPerson(record)}>
                          添加人员
                        </a>
                      </Space>
                    )}
                  />
                </Table>
              </TabPane>
            );
          })}
        </Tabs>

        {showAddTypeDialog && (
          <AddTypeDialog
            title="新增消息推送"
            loading={dialogBtnLoading}
            onClosed={() => {
              dispatch({
                type: "messagePushModel/save",
                payload: {
                  showAddTypeDialog: false,
                  dialogBtnLoading: false,
                },
              });
            }}
            onOk={this.handleSaveType}
          />
        )}

        {showAddPersonDialog && (
          <AddPersonDialog
            title="添加推送人员"
            loading={dialogBtnLoading}
            data={currentMsg}
            dataSource={personList}
            getPersonList={this.getPersonList}
            onClosed={() => {
              dispatch({
                type: "messagePushModel/save",
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
                type: "messagePushModel/save",
                payload: {
                  showDeleteDialog: false,
                  dialogBtnLoading: false,
                },
              });
            }}
            onOk={this.handleDeletePerson}
          />
        )}
      </ContentBox>
    );
  }
}

export default connect(({ messagePushModel }) => ({
  messagePushModel,
}))(MessagePushManage);
