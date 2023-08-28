"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = __importDefault(require("./api/middleware/errorHandler"));
const config_1 = require("./utils/config");
const node_routes_1 = __importDefault(require("./api/routes/node-routes"));
const nodes_routes_1 = __importDefault(require("./api/routes/nodes-routes"));
const rpc_routes_1 = __importDefault(require("./api/routes/rpc-routes"));
const receiving_routes_1 = __importDefault(require("./api/routes/receiving-routes"));
// app.use(bodyParser.json()) I listen :) 
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: '*',
}));
app.use(express_1.default.json());
app.use(rpc_routes_1.default);
app.use(node_routes_1.default);
app.use(nodes_routes_1.default);
app.use(receiving_routes_1.default);
app.all('*', (req, res, next) => {
    const err = new Error(`Couldn't find ${req.originalUrl}, did you misspell the url?`);
    (err.status = 'Not Found'), (err.statusCode = 404);
    next(err);
});
app.use(errorHandler_1.default);
const PORT = config_1.defaultPORT;
app.listen(PORT, () => { console.log(`Express is listening to port ${config_1.defaultPORT}`); });
//# sourceMappingURL=server.js.map