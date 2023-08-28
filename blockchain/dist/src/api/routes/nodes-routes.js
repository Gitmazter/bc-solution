"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nodesRouter = express_1.default.Router();
const { registerBroadcastNode, registerSingleNode, registerNodes, consensus, listNodes } = require('../controllers/nodes-controller');
nodesRouter.route('/nodes/register-broadcast-node').post(registerBroadcastNode);
nodesRouter.route('/nodes/register-node').post(registerSingleNode);
nodesRouter.route('/nodes/register-nodes').post(registerNodes);
nodesRouter.route('/nodes/consensus').get(consensus);
nodesRouter.route('/nodes/list-nodes').get(listNodes);
exports.default = nodesRouter;
//# sourceMappingURL=nodes-routes.js.map