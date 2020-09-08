import axios from "axios";

export default async function request(options) {
  options = FormatOptions(options);
  const service = axios.create({
    // baseURL: 'https://api.example.com'
  });
  // request拦截器
  service.interceptors.request.use(
    (config) => {
      // 在发送请求之前做些什么
      const userInfo = JSON.parse(window.localStorage.getItem("user")) || {};
      config.headers.token = (userInfo && userInfo.token) || "";
      return config;
    },
    (error) => {
      // 对请求错误做些什么
      Promise.reject(error);
    }
  );
  // 添加响应拦截器
  service.interceptors.response.use(
    (response) =>
      // 对响应数据做点什么
      response,
    (error) => {
      // 对响应错误做点什么
      return error.response;
    }
  );
  let response;
  try {
    response = await service(options);
    return response;
  } catch (err) {
    return response;
  }
}

// 格式化参数
const FormatOptions = (options) => {
  const { method = "get", url, params = {} } = options;
  // let
  if (method.toLowerCase() === "get") {
    return { method: "get", url, params };
  }
  if (method.toLowerCase() === "post") {
    return { method: "post", url, data: params };
  }
};
