import React from "react";
import ContentWrap from "../contentWrap";
import T from "prop-types";
import styled from "styled-components";
import request from "../../services/request";
import { Prefix } from "../../utils/config";
import redCircular from "../../assets/redCircular.png";
import blueCircular from "../../assets/blueCircular.png";
import orangeCircular from "../../assets/orangeCircular.png";
import lightning from "../../assets/lightning.png";
import combination from "../../assets/combination.png";
import amount from "../../assets/amount.png";

const BoardWrap = styled.div`
  display: flex;
  overflow-x: auto;
  .item-board {
    flex: 1;
    height: 220px;
    margin: 12px;
    display: flex;

    .item-board-left {
      flex: 2;
      text-align: center;
      position: relative;
      .item-board-left-info {
        position: relative;
        top: -140px;
        .item-board-left-info-num {
          font-size: 40px;
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
    .jump-to-list {
      cursor: pointer;
    }
    .item-board-right {
      width: 200px;
      text-align: center;
      color: #fff;
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

class TotalBoard extends React.Component {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      earlyWarningNo: 0,
      inventoryProductAmount: 0,
      inventoryProductNo: 0,
      inventoryWarningNo: 0,
      rec7DConsumeAmount: 0,
      prettyProductAmount: 0,
      prettyRec7DConsumeAmount: 0,
      rec7DConsumeNo: 0,
    };
  }

  componentDidMount() {
    this._checkAuthority();
  }

  async _checkAuthority(params = {}) {
    const { data: res } = await request({
      url: `${Prefix}/supply/inventory/statistic`,
      method: "post",
      params,
    });

    if (res && res.success) {
      const { data } = res;
      this.setState({
        ...data,
      });
    } else {
      // callBack && callBack(res);
    }
  }

  cliclkToList = (key) => {
    const { onClick } = this.props;
    onClick && typeof onClick === "function" && onClick(key);
  };

  render() {
    const {
      inventoryWarningNo,
      earlyWarningNo,
      inventoryProductNo,
      prettyRec7DConsumeAmount,
      rec7DConsumeNo,
      prettyProductAmount,
    } = this.state;
    const {} = this.props;
    return (
      <ContentWrap>
        <BoardWrap>
          <div className="item-board">
            <div
              className="item-board-left light-red jump-to-list"
              onClick={() => this.cliclkToList("inventoryWarnInfo")}
            >
              <img src={redCircular} />
              <div className="item-board-left-info">
                <div className="item-board-left-info-num">
                  {inventoryWarningNo || 0}
                </div>
                <div className="item-board-left-info-text red-text-color">
                  库存预警
                </div>
              </div>
            </div>
            <div
              className="item-board-right deep-red jump-to-list"
              onClick={() => this.cliclkToList("recentWarnInfo")}
            >
              <img
                src={lightning}
                style={{ width: 50, height: 50, margin: "40px 0 25px" }}
              />
              <div>近效期预警</div>
              <div style={{ fontSize: "32px", fontWeight: 500, color: "#fff" }}>
                {earlyWarningNo}
              </div>
            </div>
          </div>
          <div className="item-board">
            <div className="item-board-left light-blue">
              <img src={blueCircular} />
              <div className="item-board-left-info">
                <div className="item-board-left-info-num">
                  {inventoryProductNo}
                </div>
                <div className="item-board-left-info-text blue-text-color">
                  库存总数
                </div>
              </div>
            </div>
            <div className="item-board-right deep-blue">
              <img
                src={combination}
                style={{ width: 50, height: 50, margin: "44px 0 25px" }}
              />
              <div>库存商品总金额（万）</div>
              <div style={{ fontSize: "32px", fontWeight: 500, color: "#fff" }}>
                {prettyProductAmount}
              </div>
            </div>
          </div>
          <div className="item-board">
            <div className="item-board-left light-orange">
              <img src={orangeCircular} />
              <div className="item-board-left-info">
                <div className="item-board-left-info-num">{rec7DConsumeNo}</div>
                <div className="item-board-left-info-text orange-text-color">
                  近7天消耗数量
                </div>
              </div>
            </div>
            <div className="item-board-right deep-orange">
              <img
                src={amount}
                style={{ width: 50, height: 50, margin: "44px 0 25px" }}
              />
              <div>近7天消耗商品总金额（万）</div>
              <div style={{ fontSize: "32px", fontWeight: 500, color: "#fff" }}>
                {prettyRec7DConsumeAmount}
              </div>
            </div>
          </div>
        </BoardWrap>
      </ContentWrap>
    );
  }
}

export default TotalBoard;
