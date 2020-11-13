import * as dd from "dingtalk-jsapi";
import { message } from "antd";
import request from "../services/request";
import { corpId, Prefix } from "./config";

// 写入用户信息到localStorage
function setUserLocalStorage(userInfo) {
  localStorage.setItem("user", JSON.stringify({ ...userInfo }));
}

/** 检查权限
 * @method _checkAuthority
 */
async function _checkAuthority(params, callBack, ctxHook) {
  const { data: res } = await request({
    url: `${Prefix}/auth/ding/login`,
    method: "post",
    params,
  });

  if (res && res.success) {
    const { data } = res;
    setUserLocalStorage(data);
    callBack && callBack(res);
    // ctxHook && ctxHook();
  } else {
    callBack && callBack(res);
    // code 401 没有权限  权限问题；
    /* 这里根据一些错误码 进行不同动作 */
    // if (res.code === 10) {
    //   let nextMessage = res.message;
    //   try {
    //     // TODO 暂时放在前端，待迁移到后端
    //     const temp = document.createElement("div");
    //     temp.innerHTML = res.message;
    //     nextMessage = temp.innerText;
    //   } catch (e) {
    //     // e
    //   }
    // } else {
    //   // 统一错误处理
    // }
  }
}

// 正常登陆
function loginUtil({ callBack, ctxHook }) {
  // 添加模拟登录逻辑
  //   if (Utils.getUrlParam("mock_phone")) {
  //     const config = {
  //       data: { mobile: Utils.getUrlParam("mock_phone") }, // 13426273973 17887931446
  //       url: `//${COLLEGE_HOST}/account/dingLoginTest?hirer=${hirer || "hm"}`,
  //     };
  //     _checkAuthority(config, callBack, ctxHook);
  //     return;
  //   }
  dd.ready(() => {
    dd.runtime.permission.requestAuthCode({
      corpId,
      onSuccess(result) {
        const tempCode = result.code && result.code.trim();
        const params = {
          code: tempCode,
          appSign: "dev",
        };
        _checkAuthority(params, callBack, ctxHook);
      },
      onFail(err) {
        console.error("dd.runtime.permission.requestAuthCode", corpId, err);
        let content = err || "服务器开了小差，请稍后重试";
        if (err.errcode || err.errorCode || err.errmsg || err.errorMessage)
          content = `${err.errcode || err.errorCode} - ${
            err.errmsg || err.errorMessage
          }`;
        message.error({
          content,
        });
      },
    });
  });
}

// function getUserInfo() {
//   let userInfo = {};
//   try {
//     userInfo = JSON.parse(window.localStorage.getItem("user")) || {};
//   } catch (e) {
//     userInfo = {};
//   }
//   return userInfo;
// }

export default loginUtil;
