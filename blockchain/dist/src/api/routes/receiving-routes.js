"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const receivingRouter = express_1.default.Router();
const { receiveBlock, receiveTransaction } = require('../controllers/receiving-controller');
receivingRouter.route('/receive/block').post(receiveBlock);
receivingRouter.route('/receive/tx').post(receiveTransaction);
exports.default = receivingRouter;
//# sourceMappingURL=receiving-routes.js.map