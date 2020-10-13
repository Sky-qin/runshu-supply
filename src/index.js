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
app.model(require("./models/realInventoryModel").default);
app.model(require("./models/productLibraryModel").default);
app.model(require("./models/feedbackModel").default);
app.model(require("./models/menuModel").default);
app.model(require("./models/businessProductsModel").default);
app.model(require("./models/replenishmentModel").default);
app.model(require("./models/oneProductCodeModel").default);
app.model(require("./models/deliveryManageModel").default);
app.model(require("./models/shipperManageModel").default);
app.model(require("./models/recentWarnModel").default);
app.model(require("./models/recentWarnModelInfo").default);
app.model(require("./models/inventoryWarnModel").default);
app.model(require("./models/inventoryWarnInfoModel").default);
app.model(require("./models/inventoryManageModel").default);
app.model(require("./models/supplierManageModel").default);
app.model(require("./models/manufacturerManageModel").default);
app.model(require("./models/homeModel").default);
app.model(require("./models/sunshinePurchaseInfoModel").default);
app.model(require("./models/stockListModel").default);
app.model(require("./models/messagePushModel").default);

// 4. Router
app.router(require("./router").default);

// 5. Start
app.start("#root");
