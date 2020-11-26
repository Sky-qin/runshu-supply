import React from "react";
import { Affix } from "antd";
import "./index.scss";

class RetrunAffix extends React.Component {
  render() {
    const { history } = this.props;
    return (
      <Affix
        style={{
          position: "absolute",
          bottom: "30px",
          right: "40px",
          zIndex: 100,
        }}
        onClick={() => history.go(-1)}
      >
        <i className="iconfont iconfh retrun-icon" />
      </Affix>
    );
  }
}

export default RetrunAffix;
