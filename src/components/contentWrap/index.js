import React from "react";
import styled from "styled-components";
import { Spin, ConfigProvider, Affix } from "antd";
import T from "prop-types";
import zhCN from "antd/es/locale/zh_CN";

import "./index.scss";

const ContentDiv = styled.div`
  margin: 12px;
  padding: 12px;
  box-shadow: 0px 10px 15px 0px rgba(6, 0, 95, 0.05);
  background: #fff;
`;

class ContentBox extends React.Component {
  static propTypes = {
    loading: T.bool,
  };
  static defaultProps = {
    loading: false,
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { children, loading, style = {}, hasRetrun, props } = this.props;
    return (
      <ContentDiv style={style}>
        <ConfigProvider locale={zhCN}>
          <Spin tip="数据加载中..." spinning={loading}>
            {children}
          </Spin>
        </ConfigProvider>
        {hasRetrun && (
          <Affix
            style={{
              position: "absolute",
              bottom: "30px",
              right: "40px",
              zIndex: 100,
            }}
            onClick={() => props.history.go(-1)}
          >
            <i className="iconfont iconfh retrun-icon" />
          </Affix>
        )}
      </ContentDiv>
    );
  }
}

export default ContentBox;
