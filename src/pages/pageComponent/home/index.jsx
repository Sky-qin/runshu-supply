import React from "react";
import { connect } from "dva";
import styled from "styled-components";
import { Radio, Tabs } from "antd";
import { Chart, LineAdvance } from "bizcharts";
import ContentWrap from "../../../components/contentWrap";
import Sort from "../../../assets/sort.png";

import "./index.scss";

const { TabPane } = Tabs;

const WrapTopDiv = styled.div`
  display: flex;
`;

const IconWrap = styled.div`
  height: 54px;
  width: 54px;
  background: rgba(0, 0, 0, 0.12);
  border-radius: 50%;
  text-align: center;
  line-height: 54px;
  margin: 36px 18px 0px 26px;
  display: inline-block;
`;

const WrapBox = styled.div`
  margin-top: 36px;
  display: inline-block;
  .text-common {
    color: #e3fff4;
    font-weight: 500;
    font-size: 22px;
  }
  .text {
    font-size: 16px;
    color: #a5caff;
  }
  .number {
    font-size: 34px;
    font-weight: 500;
    color: #ffffff;
    line-height: 45px;
  }
`;

const WrapBoardFooter = styled.div`
  display: flex;
  padding-bottom: 20px;
  > div {
    padding-left: 30px;
    flex: 1;
  }
  .left-line {
    border-left: 1px solid rgba(255, 255, 255, 0.25);
    padding-left: 25px;
  }
`;

const WrapNum = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: #fff;
  line-height: 36px;
`;

const WrapNumText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  opacity: 0.8;
  line-height: 20px;
`;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: "homeModel/getTodayIndex" });
    this.getCartsData();
    this.getTopTenData();
  }

  getCartsData = () => {
    const { dispatch } = this.props;
    dispatch({ type: "homeModel/getStatistics" });
  };

  getTopTenData = () => {
    const { dispatch } = this.props;
    dispatch({ type: "homeModel/getIndexTopTen" });
  };

  renderSort = (index) => {
    const { topPic } = this.props.homeModel;
    let sort = index + 1;
    if (sort < 4) {
      return <img width={19} height={19} src={topPic[index]} />;
    }
    if (4 <= sort && sort < 10) {
      return `0${sort}`;
    }
    return sort;
  };

  topTenChange = (value, key) => {
    const { dispatch } = this.props;
    dispatch({
      type: "homeModel/save",
      payload: {
        [key]: value,
      },
    });

    this.getTopTenData();
  };

  changeCartsTab = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: "homeModel/save",
      payload: {
        type: value,
      },
    });

    this.getCartsData();
  };

  changeCartsDate = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: "homeModel/save",
      payload: {
        date: e.target.value || "",
      },
    });

    this.getCartsData();
  };

  renderCarts = (data) => {
    return (
      <Chart padding={[10, 40, 50, 40]} autoFit height={350} data={data}>
        <LineAdvance
          shape="smooth"
          point
          area
          position="date*count"
          // color="city"
        />
      </Chart>
    );
  };

  render() {
    const {
      dateList,
      consumeOrderTopDate,
      hospitalConsumeOrderTopDate,
      replenishOrderTopDate,
      consumeOrderTop,
      hospitalConsumeOrderTop,
      replenishOrderTop,
      chartsTabList,
      chartsDateList,
      date,
      type,
      inventoryStatistics,
      consumeStatistics,
      replenishStatistics,
      chartsData,
      totalLoading,
      chartsLoading,
      topTenLoading,
    } = this.props.homeModel;
    return (
      <>
        <ContentWrap loading={totalLoading}>
          <div className="home-board">
            <div className="home-board-inventort">
              <WrapTopDiv>
                <IconWrap>
                  <i className="board-icon iconkucun iconfont" />
                </IconWrap>
                <WrapBox>
                  <div className="text-common text">总库存</div>
                  <div className="number">{inventoryStatistics.totalStock}</div>
                </WrapBox>
              </WrapTopDiv>
              <WrapBoardFooter>
                <div>
                  <WrapNum>{inventoryStatistics.addStock}</WrapNum>
                  <WrapNumText>新增</WrapNumText>
                </div>
                <div className="left-line">
                  <WrapNum>{inventoryStatistics.totalMoney}</WrapNum>
                  <WrapNumText>金额（万元）</WrapNumText>
                </div>
              </WrapBoardFooter>
            </div>
            <div className="home-board-replenishment">
              <WrapTopDiv>
                <IconWrap>
                  <i className="board-icon iconxiangzi iconfont" />
                </IconWrap>
                <WrapBox>
                  <div className="text-common">今日补货 </div>
                </WrapBox>
              </WrapTopDiv>
              <WrapBoardFooter>
                <div>
                  <WrapNum>{consumeStatistics.add}</WrapNum>
                  <WrapNumText>新增</WrapNumText>
                </div>
                <div className="left-line">
                  <WrapNum>{consumeStatistics.confirmed}</WrapNum>
                  <WrapNumText>待确认</WrapNumText>
                </div>
                <div className="left-line">
                  <WrapNum>{consumeStatistics.money}</WrapNum>
                  <WrapNumText>金额（万元）</WrapNumText>
                </div>
              </WrapBoardFooter>
            </div>
            <div className="home-board-consume">
              <WrapTopDiv>
                <IconWrap>
                  <i className="board-icon iconxiangzi iconfont" />
                </IconWrap>
                <WrapBox>
                  <div className="text-common">今日消耗</div>
                </WrapBox>
              </WrapTopDiv>
              <WrapBoardFooter>
                <div>
                  <WrapNum>{replenishStatistics.add}</WrapNum>
                  <WrapNumText>新增</WrapNumText>
                </div>
                <div className="left-line">
                  <WrapNum>{replenishStatistics.confirmed}</WrapNum>
                  <WrapNumText>待确认</WrapNumText>
                </div>
                <div className="left-line">
                  <WrapNum>{consumeStatistics.money}</WrapNum>
                  <WrapNumText>金额（万元）</WrapNumText>
                </div>
              </WrapBoardFooter>
            </div>
          </div>
        </ContentWrap>

        <ContentWrap loading={chartsLoading}>
          <div className="carts-box">
            <div>
              <Tabs defaultActiveKey={type} onChange={this.changeCartsTab}>
                {(chartsTabList || []).map((item, index) => {
                  return (
                    <TabPane tab={item.label} key={item.value}>
                      {chartsData &&
                        chartsData.length > 0 &&
                        this.renderCarts(chartsData)}
                    </TabPane>
                  );
                })}
              </Tabs>
            </div>
            <Radio.Group
              className="carts-radio"
              options={chartsDateList}
              onChange={this.changeCartsDate}
              value={date}
              optionType="button"
            />
          </div>
        </ContentWrap>

        <ContentWrap loading={topTenLoading} style={{ padding: 0, margin: 12 }}>
          <div className="top-ten">
            <div className="top-ten-item">
              <div className="top-ten-item-top-bar">
                <div className="top-ten-item-top-bar-left">
                  <img src={Sort} height={25} />
                  消耗TOP10 耗材
                </div>
                <Radio.Group
                  options={dateList}
                  onChange={(e) =>
                    this.topTenChange(e.target.value, "consumeOrderTopDate")
                  }
                  value={consumeOrderTopDate}
                  optionType="button"
                />
              </div>
              <div className="top-ten-item-table">
                <div className="top-ten-item-table-col top-ten-item-table-header">
                  <div className="sort-row">排行</div>
                  <div className="value-row">消耗单号</div>
                  <div className="num-row">商品数量（件）</div>
                </div>
                {(consumeOrderTop || []).map((item, index) => {
                  return (
                    <div key={index} className="top-ten-item-table-col">
                      <div className="sort-row">{this.renderSort(index)}</div>
                      <div className="value-row">{item.label}</div>
                      <div className="num-row">{item.value}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="top-ten-item top-ten-center">
              <div className="top-ten-item-top-bar">
                <div className="top-ten-item-top-bar-left">
                  <img src={Sort} height={25} />
                  消耗TOP10 医院
                </div>
                <Radio.Group
                  options={dateList}
                  onChange={(e) =>
                    this.topTenChange(
                      e.target.value,
                      "hospitalConsumeOrderTopDate"
                    )
                  }
                  value={hospitalConsumeOrderTopDate}
                  optionType="button"
                />
              </div>
              <div className="top-ten-item-table">
                <div className="top-ten-item-table-col top-ten-item-table-header">
                  <div className="sort-row">排行</div>
                  <div className="value-row">医院</div>
                  <div className="num-row">商品数量（件）</div>
                </div>
                {(hospitalConsumeOrderTop || []).map((item, index) => {
                  return (
                    <div key={index} className="top-ten-item-table-col">
                      <div className="sort-row">{this.renderSort(index)}</div>
                      <div className="value-row">{item.label}</div>
                      <div className="num-row">{item.value}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="top-ten-item">
              <div className="top-ten-item-top-bar">
                <div className="top-ten-item-top-bar-left">
                  <img src={Sort} height={25} />
                  下订单TOP10 医院
                </div>
                <Radio.Group
                  options={dateList}
                  onChange={(e) =>
                    this.topTenChange(e.target.value, "replenishOrderTopDate")
                  }
                  value={replenishOrderTopDate}
                  optionType="button"
                />
              </div>
              <div className="top-ten-item-table">
                <div className="top-ten-item-table-col top-ten-item-table-header">
                  <div className="sort-row">排行</div>
                  <div className="value-row">医院</div>
                  <div className="num-row">订单数量</div>
                </div>
                {(replenishOrderTop || []).map((item, index) => {
                  return (
                    <div key={index} className="top-ten-item-table-col">
                      <div className="sort-row">{this.renderSort(index)}</div>
                      <div className="value-row">{item.label}</div>
                      <div className="num-row">{item.value}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ContentWrap>
      </>
    );
  }
}

export default connect(({ homeModel }) => ({
  homeModel,
}))(Home);
