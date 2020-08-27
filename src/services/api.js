import { Prefix } from "../utils/config";
import request from "./request";

const API = {
  miniGetInfo(params) {
    return request({
      url: `${Prefix}/mini/getinfo`,
      params,
    });
  },
  miniPostInfo(params) {
    return request({
      url: `${Prefix}/mini/postInfo`,
      method: "post",
      params,
    });
  },
};

export default API;
