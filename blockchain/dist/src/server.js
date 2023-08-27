"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = __importDefault(require("./api/middleware/errorHandler"));
const node_routes_1 = __importDefault(require("./api/routes/node-routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: '*',
}));
app.use(body_parser_1.default.json());
app.use(node_routes_1.default);
// app.use(express.json())
app.all('*', (req, res, next) => {
    const err = new Error(`Couldn't find ${req.originalUrl}, did you misspell the url?`);
    (err.status = 'Not Found'), (err.statusCode = 404);
    next(err);
});
app.use(errorHandler_1.default);
const PORT = 8080;
app.listen(PORT, () => { console.log('Express is listening to port 8080'); });
//# sourceMappingURL=server.js.map