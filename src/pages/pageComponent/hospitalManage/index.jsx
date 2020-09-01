import React from "react";
import { connect } from "dva";
import { Table, Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import T from "prop-types";
import ContentBox from "../../../components/contentWrap";
// import style
import "./index.scss";
const { Column } = Table;

class HospitalManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // this.handleLogin();
  }

  changePagination = (current, pageSize) => {
    console.log(current, pageSize);
  };
  render() {
    return (
      <ContentBox>
        <div className="opreation-bar">
          <Button type="primary" icon={<PlusOutlined />}>
            新增
          </Button>
        </div>
        <Table
          bordered
          rowKey={(record, index) => index}
          dataSource={[
            { name: "ssss", age: "12" },
            { name: "ssss", age: "21" },
          ]}
          pagination={{
            position: ["bottomCenter"],
            current: 2,
            total: 100,
            pageSize: 10,
            onChange: (value) => this.changePagination(value, 10),
            onShowSizeChange: (value) => this.changePagination(1, value),
          }}
        >
          <Column
            title="序号"
            render={(value, record, index) => index + 1}
            width={65}
          />
          <Column title="医院名称" dataIndex="hospital" />
          <Column title="科室" dataIndex="department" />
          <Column title="城市" dataIndex="city" />
          <Column title="地址" dataIndex="adress" />
          <Column title="联系人" dataIndex="adress" />
          <Column title="联系电话" dataIndex="adress" />
          <Column
            title="操作"
            dataIndex="name"
            width={110}
            render={(value, record, index) => (
              <Space size="middle">
                <a>编辑</a>
                <a>删除</a>
              </Space>
            )}
          />
        </Table>
      </ContentBox>
    );
  }
}

export default connect(({ loginModel }) => ({
  loginModel,
}))(HospitalManage);
