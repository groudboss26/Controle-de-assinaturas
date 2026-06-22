"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
require("./config/database.js");
const port = Number(process.env.PORT) || 3000;
app_js_1.app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
