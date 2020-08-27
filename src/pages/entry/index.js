import React from "react";
import { connect } from "dva";
import PropTypes from "prop-types";
import { Button } from "antd";
import Example from "../../components/Example";
import "./index.scss";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "test/queryInfo",
    });
  }

  handleDown = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "example/downAge",
    });
  };

  render() {
    const { age } = this.props.example;
    return (
      <div>
        <h1 className="home-title">Hello Home Page</h1>
        <Button onClick={() => this.handleDown()}>sss</Button>
        <div className="age-span">{age}</div>
        <Example />
        <div className="outer-bocx">
          外部文字
          <div className="inner-box">内部文字</div>
        </div>
        <div className="div-box">
          我是divbox
          <div>我是divboxas</div>
          <div className="book">adsadad</div>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  name: PropTypes.string,
};

export default connect(({ example, test }) => ({
  example,
  test,
}))(Home);
