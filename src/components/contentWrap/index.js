import React from "react";
import T from "prop-types";
import styled from "styled-components";
import { Spin, ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";

import "./index.scss";

const ContentDiv = styled.div`
  margin: 12px;
  padding: 12px;
  box-shadow: 0px 10px 15px 0px rgba(6, 0, 95, 0.05);
  background: #fff;
`;

class ContentBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { children, loading } = this.props;
    return (
      <ContentDiv>
        <ConfigProvider locale={zhCN}>
          <Spin spinning={loading}>{children}</Spin>
        </ConfigProvider>
      </ContentDiv>
    );
  }
}

export default ContentBox;
