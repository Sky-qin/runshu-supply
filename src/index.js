import dva from "dva";
import "./utils/rem";
import "./index.css";
// import request from "./services/request";

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require("./models/entryModel").default);
app.model(require("./models/login").default);
app.model(require("./models/departmentManage").default);
app.model(require("./models/hospitalManage").default);
app.model(require("./models/powerManage").default);
app.model(require("./models/personnelManage").default);
app.model(require("./models/wxPersonnelManage").default);
app.model(require("./models/consumeModel").default);
app.model(require("./models/inventory").default);
app.model(require("./models/productInfo").default);
app.model(require("./models/feedbackModel").default);
app.model(require("./models/menuModel").default);
app.model(require("./models/businessProductsModel").default);

// 4. Router
app.router(require("./router").default);

// 5. Start
app.start("#root");
