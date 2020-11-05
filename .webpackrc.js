const baseSize = 16;
const pxtorem = require("postcss-pxtorem");
const pxtorem2 = _interopRequireDefault(pxtorem).default;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

export default {
  entry: "./src/index.js",
  env: {
    development: {
      extraBabelPlugins: [
        [
          "import",
          { libraryName: "antd", libraryDirectory: "es", style: "css" },
        ],
      ],
      disableCSSModules: true,
      // publicPath: "/",
      extraPostCSSPlugins: [
        pxtorem2({ rootValue: baseSize, propWhiteList: [] }),
      ],
    },
    production: {
      extraBabelPlugins: [
        [
          "import",
          { libraryName: "antd", libraryDirectory: "es", style: "css" },
        ],
      ],
      disableCSSModules: true,
      // publicPath: "/pad4/dist/",
      extraPostCSSPlugins: [
        pxtorem2({ rootValue: baseSize, propWhiteList: [] }),
      ],
    },
  },
  define: {
    "process.env": {
      API_EVN: process.env.API_EVN,
    },
  },
};
