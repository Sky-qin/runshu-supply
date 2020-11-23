import React from "react";
import ContentWrap from "../contentWrap";
// import T from "prop-types";
import styled from "styled-components";
import blueCircular from "../../assets/blueCircular.png";
import orangeCircular from "../../assets/orangeCircular.png";
import lightning from "../../assets/lightning.png";
import warning from "../../assets/warning.png";
import combination from "../../assets/combination.png";
import amount from "../../assets/amount.png";

const BoardWrap = styled.div`
  display: flex;
  overflow-x: auto;
  .item-board {
    flex: 1;
    height: 150px;
    margin: 12px;
    display: flex;

    .item-board-left {
      flex: 2;
      text-align: center;
      position: relative;
      border-radius: 5px 0 0 5px;
      .item-board-left-info {
        position: relative;
        top: -100px;
        .item-board-left-info-num {
          font-size: 28px;
          font-weight: 600;
          color: #fff;
          line-height: 56px;
        }
        .item-board-left-info-text {
          font-size: 16px;
          font-weight: 500;

          line-height: 22px;
        }
        .red-text-color {
          color: #ffbdbe;
        }
        .blue-text-color {
          color: #a5caff;
        }
        .orange-text-color {
          color: #ffe1d3;
        }
      }
    }
    .item-board-right {
      width: 200px;
      text-align: center;
      color: #fff;
      border-radius: 0px 5px 5px 0px;
    }
    .light-red {
      background: #ff696b;
    }
    .deep-red {
      background: #ff585a;
    }
    .light-blue {
      background: #2680ff;
    }
    .deep-blue {
      background: #1677ff;
    }
    .light-orange {
      background: #ff9b67;
    }
    .deep-orange {
      background: #ff9157;
    }
  }
`;

const SmallBoardWrap = styled.div`
  height: 150px;
  min-width: 245px;
  margin: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
`;

class TotalBoard extends React.Component {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  cliclkToList = (key) => {
    const { onClick } = this.props;
    onClick && typeof onClick === "function" && onClick(key);
  };

  render() {
    const { data, loading } = this.props;
    return (
      <ContentWrap loading={loading}>
        <BoardWrap>
          <SmallBoardWrap
            style={{ background: "rgba(20, 213, 112, 1)" }}
            onClick={() => this.cliclkToList("inventoryWarnInfo")}
          >
            <img
              alt="图片"
              src={warning}
              style={{ width: 33, height: 33, margin: "28px 0 10px" }}
            />
            <div>库存预警</div>
            <div style={{ fontSize: "28px", fontWeight: 500, color: "#fff" }}>
              {data.inventoryWarningNo || 0}
            </div>
          </SmallBoardWrap>
          <SmallBoardWrap
            style={{ background: "rgba(34, 171, 255, 1)" }}
            onClick={() => this.cliclkToList("recentWarnInfo")}
          >
            <img
              alt="图片"
              src={lightning}
              style={{ width: 33, height: 33, margin: "28px 0 10px" }}
            />
            <div>近效期预警</div>
            <div style={{ fontSize: "28px", fontWeight: 500, color: "#fff" }}>
              {data.earlyWarningNo}
            </div>
          </SmallBoardWrap>
          <div className="item-board">
            <div className="item-board-left light-blue">
              <img alt="图片" src={blueCircular} />
              <div className="item-board-left-info">
                <div className="item-board-left-info-num">
                  {data.inventoryProductNo || 0}
                </div>
                <div className="item-board-left-info-text blue-text-color">
                  库存总数
                </div>
              </div>
            </div>
            <div className="item-board-right deep-blue">
              <img
                alt="图片"
                src={combination}
                style={{ width: 33, height: 33, margin: "28px 0 10px" }}
              />
              <div>库存商品总金额（万）</div>
              <div style={{ fontSize: "28px", fontWeight: 500, color: "#fff" }}>
                {data.prettyProductAmount || 0}
              </div>
            </div>
          </div>
          <div className="item-board">
            <div className="item-board-left light-orange">
              <img alt="图片" src={orangeCircular} />
              <div className="item-board-left-info">
                <div className="item-board-left-info-num">
                  {data.rec7DConsumeNo}
                </div>
                <div className="item-board-left-info-text orange-text-color">
                  近7天消耗数量
                </div>
              </div>
            </div>
            <div className="item-board-right deep-orange">
              <img
                src={amount}
                alt="图片"
                style={{ width: 33, height: 33, margin: "28px 0 10px" }}
              />
              <div>近7天消耗商品总金额（万）</div>
              <div style={{ fontSize: "28px", fontWeight: 500, color: "#fff" }}>
                {data.prettyRec7DConsumeAmount}
              </div>
            </div>
          </div>
        </BoardWrap>
      </ContentWrap>
    );
  }
}

export default TotalBoard;
