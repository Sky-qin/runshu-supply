import React from "react";
import { connect } from "dva";
import styled from "styled-components";
import ContentBox from "../../../components/contentWrap";
import PicList from "./config";
import "./index.scss";

const WrapDiv = styled.div`
  margin: 30px;
  text-align: center;
  display: inline-block;
`;

const ImgWrap = styled.img`
  width: 110px;
  height: 110px;
  padding-bottom: 8px;
  cursor: pointer;
`;

class BasicConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  jumpToConfig = ({ value, label }) => {
    const { history } = this.props;
    history.push(`/entry/${value}`);
  };

  render() {
    const { list = [] } = this.props.basicConfigModel;
    return (
      <ContentBox>
        <div>
          {list.map((item, index) => {
            return (
              <WrapDiv key={index}>
                <ImgWrap
                  key={item.value}
                  alt={item.label}
                  src={PicList[item.value]}
                  onClick={() => this.jumpToConfig(item)}
                />
                <div>{item.label}</div>
              </WrapDiv>
            );
          })}
        </div>
      </ContentBox>
    );
  }
}

export default connect(({ basicConfigModel }) => ({
  basicConfigModel,
}))(BasicConfig);
