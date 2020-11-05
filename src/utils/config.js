const corpId = "dingcda3f8b5a069ac58bc961a6cb783455b";

// const Prefix = "//192.168.1.175:8081";
// const Prefix = "//192.168.1.127:8081";
// const Prefix = "//10.0.0.177:8081";
// const Prefix = "//192.168.1.178:8081";

const localdev = "https://order.runshutech.com";
const dev = "https://order.runshutech.com";
const prod = "https://supply.runshutech.com/";
const API_EVN = process.env.API_EVN;
const Prefix = getApiHost(API_EVN);

function getApiHost(value) {
  if (value === "localdev") {
    return localdev;
  } else if (value === "dev") {
    return dev;
  } else if (value === "prod") {
    return prod;
  }
}

export { Prefix, corpId };
