const corpId = "dingcda3f8b5a069ac58bc961a6cb783455b";

// const localdev = "//192.168.1.175:8081";
// const localdev = "//192.168.1.127:8081";
const localdev = "//10.0.0.177:8081";
// const localdev = "//192.168.1.178:8081";
// const localdev = "https://order.runshutech.com";

const dev = "https://order.runshutech.com";
const prod = "https://supply.runshutech.com";
const API_EVN = process.env.API_EVN;
const Prefix = getApiHost(API_EVN);
const PicPrefix = getPicHost(API_EVN);

function getApiHost(value) {
  if (value === "localdev") {
    return localdev;
  } else if (value === "dev") {
    return dev;
  } else if (value === "prod") {
    return prod;
  }
}

function getPicHost(value) {
  if (value === "localdev") {
    return "https://filesystem.runshutech.com/";
  } else if (value === "dev") {
    return "https://filesystem.runshutech.com/";
  } else if (value === "prod") {
    return "https://fdfs.runshutech.com/";
  }
}

export { Prefix, corpId, PicPrefix };
