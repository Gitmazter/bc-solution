"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const port = 3000;
const http = (0, express_1.default)();
http.use(express_1.default.json());
http.use((0, cors_1.default)());
http.get('/ping', (req, res) => {
    res.status(200).json('Pong');
});
http.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map