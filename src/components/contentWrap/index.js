import React from "react";
import T from "prop-types";
import styled from "styled-components";

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
    const { children } = this.props;
    return <ContentDiv>{children}</ContentDiv>;
  }
}

export default ContentBox;
