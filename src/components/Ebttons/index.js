import React from "react";
import { CloseOutlined, PlusCircleOutlined } from "@ant-design/icons";
import "./index.scss";
import { Input, message } from "antd";

class Ebttons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: null,
      data: this.props.data || [],
    };
  }

  componentDidMount() {}

  handleChange = (value, index) => {
    const { data, onChange } = this.props;
    data[index] = value;
    this.setState({ data });
    onChange && typeof onChange === "function" && onChange(data);
  };

  handleAdd = () => {
    const { data, onChange } = this.props;
    let canAdd = true;
    data.map((item) => {
      if (!item) {
        canAdd = false;
        message.warning("请在输入框输入值后再添加！");
      }
      return null;
    });
    if (canAdd) {
      data.push("");
      this.setState({
        activeKey: data.length - 1,
        data,
      });
      onChange && typeof onChange === "function" && onChange(data);
    }
  };

  handleDelete = (index) => {
    const { data, onChange } = this.props;

    data.splice(index, 1);

    this.setState({
      activeKey: null,
      data,
    });
    onChange && typeof onChange === "function" && onChange(data);
  };

  render() {
    const { canAdd = true, canDelete = true } = this.props;
    const { activeKey, data } = this.state;
    return (
      <div>
        {(data || []).map((item, index) => {
          return (
            <span className="e-button" key={index}>
              {activeKey === index || item === "" ? (
                <Input
                  bordered={false}
                  className="e-input"
                  placeholder="请输入"
                  defaultValue={item || ""}
                  onBlur={() => this.setState({ activeKey: null })}
                  onChange={(e) => this.handleChange(e.target.value, index)}
                />
              ) : (
                <span
                  style={{ display: "inline-block", height: "32px" }}
                  onClick={() => this.setState({ activeKey: index })}
                >
                  {item || ""}
                </span>
              )}
              {canDelete && (
                <CloseOutlined
                  onClick={() => this.handleDelete(index)}
                  className="e-delete-icon"
                />
              )}
            </span>
          );
        })}
        {canAdd && (
          <PlusCircleOutlined
            onClick={() => this.handleAdd()}
            className="e-add-icon"
          />
        )}
      </div>
    );
  }
}

export default Ebttons;
