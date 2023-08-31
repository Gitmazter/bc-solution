"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const nodeRouter = express.Router();
const { addTransaction, newVehicle, getOwnerVehicles, vehicleTransfer, mineBlock, } = require('../controllers/node-controller');
nodeRouter.route('/node/add-transaction').post(addTransaction);
nodeRouter.route('/node/mine-block').get(mineBlock);
nodeRouter.route('/node/new-vehicle').post(newVehicle);
nodeRouter.route('/node/transfer-vehicle').post(vehicleTransfer);
nodeRouter.route('/node/owner-search').post(getOwnerVehicles);
exports.default = nodeRouter;
//# sourceMappingURL=node-routes.js.map