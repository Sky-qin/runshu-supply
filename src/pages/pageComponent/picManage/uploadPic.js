import React from "react";
import { Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}

class Avatar extends React.Component {
  state = {
    loading: false,
  };

  handleChange = (info) => {
    const { onChange } = this.props;
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      const { response } = info.file;
      if (response && response.success) {
        onChange &&
          typeof onChange === "function" &&
          onChange((response.data && response.data.fullPath) || "");
      }
    }
  };

  render() {
    const { loading } = this.state;
    const { imageUrl } = this.props;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>图片上传</div>
      </div>
    );
    return (
      <Upload
        name="file"
        listType="picture-card"
        showUploadList={false}
        action="https://order.runshutech.com/file/upload"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? (
          <img
            src={`https://filesystem.runshutech.com/${imageUrl}`}
            alt="avatar"
            style={{ width: "100%" }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
    );
  }
}

export default Avatar;
