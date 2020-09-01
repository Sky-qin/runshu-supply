import React from "react";
import { connect } from "dva";
import { Table, Button } from "antd";
import ContentWrap from "../../../components/contentWrap";
import "./index.scss";

class HospitalManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // this.handleLogin();
  }

  render() {
    return (
      <ContentWrap>
        <div>sssss</div>
        <Table dataSource={data} border>
          <Column
            title="序号"
            render={(value, record, index) => index + 1}
            width={60}
          />
          <Column title="医院" dataIndex="hospital" />
          <Column title="科室" dataIndex="department" />
          <Column title="城市" dataIndex="city" />
          <Column title="地址" dataIndex="adress" />
          <Column title="联系人" dataIndex="" />
          <Column title="联系电话" dataIndex="" />
          <Column
            title="操作"
            render={(value, record) => (
              <Space size="middle">
                <a>编辑</a>
                <a>删除</a>
              </Space>
            )}
          />
        </Table>
      </ContentWrap>
    );
  }
}

export default connect(({ loginModel }) => ({
  loginModel,
}))(HospitalManage);
