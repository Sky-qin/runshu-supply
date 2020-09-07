import dva from "dva";
import "./utils/rem";
import "./index.css";

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require("./models/example").default);
app.model(require("./models/test").default);
app.model(require("./models/login").default);
app.model(require("./models/departmentManage").default);
app.model(require("./models/hospitalManage").default);
app.model(require("./models/powerManage").default);
app.model(require("./models/personnelManage").default);
app.model(require("./models/consumeModel").default);

// 4. Router
app.router(require("./router").default);

// 5. Start
app.start("#root");
