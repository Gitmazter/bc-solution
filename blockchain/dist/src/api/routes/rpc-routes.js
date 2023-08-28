"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rpcRouter = express_1.default.Router();
const { ping, latestBlock, getBlockchain } = require('../controllers/rpc-controller');
rpcRouter.route('/rpc/ping').get(ping);
rpcRouter.route('/rpc/latest-block').get(latestBlock);
rpcRouter.route('/rpc/get-blockchain').get(getBlockchain);
exports.default = rpcRouter;
//# sourceMappingURL=rpc-routes.js.map