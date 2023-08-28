"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const nodeRouter = express.Router();
const { addTransaction, mineBlock, } = require('../controllers/node-controller');
nodeRouter.route('/node/add-transaction').post(addTransaction);
nodeRouter.route('/node/mine-block').get(mineBlock);
exports.default = nodeRouter;
//# sourceMappingURL=node-routes.js.map