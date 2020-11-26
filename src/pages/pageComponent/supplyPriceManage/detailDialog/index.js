import React from "react";
import styled from "styled-components";
import { Drawer, Table, Input, Button, Spin, Tree, Tooltip, Radio } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { OpreationBar } from "wrapd";

const { Column } = Table;

const BasicDiv = styled.div`
  margin-bottom: 50px;
  margin-top: 20px;
  dispaly: flex;
  .detail-left {
    width: 260px;
    overflow-y: scroll;
    height: 650px;
  }
  .detail-right {
    width: calc(100% - 200px);
  }
`;

class DetailDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: null,
      selectNode: {},
    };
  }

  handleCancel = () => {
    const { onClosed } = this.props;
    onClosed && typeof onClosed === "function" && onClosed();
  };

  onClickNode = (value, { node }) => {
    const { keyword } = this.state;
    const { changeCategory } = this.props;
    this.setState({ selectNode: node });
    changeCategory &&
      typeof changeCategory === "function" &&
      changeCategory(node, keyword);
  };

  getTableList = (current = 1, size = 10) => {
    const { keyword, selectNode } = this.state;
    const { changeCategory } = this.props;
    changeCategory &&
      typeof changeCategory === "function" &&
      changeCategory(selectNode, keyword, current, size);
  };

  onChangePrice = (e, key, index) => {
    const { value } = e.target;
    const { onChangeList, data } = this.props;
    const { detailList } = data;

    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === "" || value === "-") {
      detailList[index][key] = value;
      let list = [...detailList];
      onChangeList && typeof onChangeList === "function" && onChangeList(list);
    }
  };

  onChangeCompCode = (e, key, index) => {
    const { value } = e.target;
    const { onChangeList, data } = this.props;
    const { detailList } = data;
    detailList[index][key] = value;
    let list = [...detailList];
    onChangeList && typeof onChangeList === "function" && onChangeList(list);
  };

  onBlur = (e, record, key) => {
    const { onSavePrice } = this.props;
    onSavePrice &&
      typeof onSavePrice === "function" &&
      onSavePrice(record, key, this.getTableList);
  };

  changePagination = (current, size) => {
    this.getTableList(current, size);
  };

  render() {
    const { keyword } = this.state;
    const { data = {}, title, canEdit = true } = this.props;
    const {
      categoryTree,
      drawerLoading,
      detailList,
      relationName,
      dialogSize: size,
      dialogCurrent: current,
      dialogTotal: total,
    } = data;
    return (
      <Drawer
        title={title || "详情"}
        visible
        width="85%"
        className="drawer-box"
        onClose={this.handleCancel}
        maskClosable={false}
      >
        <Spin spinning={drawerLoading}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "12px",
            }}
          >
            {relationName}
          </div>
          <div style={{ width: 360, display: "inline-block", marginRight: 15 }}>
            <Input
              style={{ width: 325 }}
              placeholder="请输入产品名称、型号、编码"
              value={keyword}
              onChange={(e) => this.setState({ keyword: e.target.value })}
              allowClear
            />
            <Button
              style={{ position: "relative", left: "-3px", top: "1px" }}
              onClick={() => this.getTableList(1, 10)}
              icon={<SearchOutlined />}
            />
          </div>
          <BasicDiv style={{ display: "flex" }}>
            <div className="detail-left">
              <div>产品信息目录</div>
              <Tree
                defaultExpandAll
                treeData={categoryTree}
                checkStrictly
                onSelect={this.onClickNode}
              />
            </div>
            <div className="detail-right">
              <OpreationBar
                // buttonList={[
                //   { key: "add", label: "新增价格方案", icon: <PlusOutlined /> },
                // ]}
                total={total}
                // onClick={this.handleClick}
              />
              <Table
                bordered
                dataSource={detailList}
                rowKey={(record, index) => index}
                pagination={{
                  position: ["bottomCenter"],
                  current: current,
                  total: total,
                  pageSize: size,
                  onChange: this.changePagination,
                  onShowSizeChange: this.changePagination,
                }}
              >
                <Column
                  title="序号"
                  render={(value, record, index) => index + 1}
                  width={80}
                />
                <Column title="产品编码" dataIndex="productCode" width={125} />
                <Column title="产品名称" dataIndex="productName" width={180} />
                <Column
                  title="产品分类"
                  dataIndex="productCategory"
                  width={100}
                />
                <Column title="型号" dataIndex="model" width={100} />
                <Column
                  title="生产厂家"
                  dataIndex="productVendorName"
                  width={160}
                />
                <Column
                  title="是否在售"
                  dataIndex="isOnsale"
                  fixed="right"
                  width={160}
                  render={(value) => {
                    return (
                      <Radio.Group
                        options={[
                          { value: true, label: "在售" },
                          { value: false, label: "停售" },
                        ]}
                        disabled
                        value={value}
                      />
                    );
                  }}
                />

                <Column
                  fixed="right"
                  title="供货价格"
                  dataIndex="price"
                  width={120}
                  render={(value, record, index) => {
                    return canEdit ? (
                      <Tooltip
                        trigger={["focus"]}
                        title={value}
                        placement="topLeft"
                        overlayClassName="numeric-input"
                      >
                        <Input
                          onChange={(e) =>
                            this.onChangePrice(e, "price", index)
                          }
                          onBlur={(e) => this.onBlur(e, record, "price")}
                          value={value}
                        />
                      </Tooltip>
                    ) : (
                      value
                    );
                  }}
                />
                <Column
                  fixed="right"
                  title="中标组件码	"
                  dataIndex="winCompCode"
                  width={120}
                  render={(value, record, index) => {
                    return canEdit ? (
                      <Tooltip
                        trigger={["focus"]}
                        title={value}
                        placement="topLeft"
                        overlayClassName="numeric-input"
                      >
                        <Input
                          onChange={(e) =>
                            this.onChangeCompCode(e, "winCompCode", index)
                          }
                          onBlur={(e) => this.onBlur(e, record, "winCompCode")}
                          value={value}
                        />
                      </Tooltip>
                    ) : (
                      value
                    );
                  }}
                />
              </Table>
            </div>
          </BasicDiv>

          {/* <FooterBar>
            <Button type="primary" onClick={this.handleSubmit}>
              提交
            </Button>
          </FooterBar> */}
        </Spin>
      </Drawer>
    );
  }
}

export default DetailDialog;
